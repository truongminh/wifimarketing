import { Toolboxes, GetWNodeActive } from "@render/node";
import { Rebounder } from "./rebounder";
import { Context } from "@src/core";
import { GetPageState } from "@src/state";

const enum EditMode {
    None,
    Normal,
    Advanced
}

export class ToolboxContainer {
    private container = (() => {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.zIndex = '1';
        return container;
    })();
    private rebounder = (() => {
        const bounds = {
            x: 0,
            y: 0,
            w: this.stage.offsetWidth,
            h: this.stage.offsetHeight
        };
        const rebounder = new Rebounder(this.container, this.ctx, bounds);
        return rebounder;
    })();

    private onStageMouseDown = (e: MouseEvent) => { };
    private wnodeActive = GetWNodeActive(this.ctx);
    private pageState = GetPageState(this.ctx);
    private mode = EditMode.None;
    private tools = new Toolboxes(this.container, this.ctx);

    constructor(private stage: HTMLElement, private ctx: Context) {
        this.stage.appendChild(this.container);
        this.registerEvent();
    }

    private registerEvent() {
        this.onStageMouseDown = (e: MouseEvent) => {
            if (this.mode === EditMode.Normal) {
                this.setMode(EditMode.None);
            } else if (this.mode === EditMode.Advanced) {
                this.setMode(EditMode.Normal);
            }
        };
        this.rebounder.onDoubleClick = () => {
            this.setMode(EditMode.Advanced);
        };
        this.stage.addEventListener('mousedown', this.onStageMouseDown);
        this.container.onmousedown = (e: MouseEvent) => {
            // do not prevent the default behavior
            e.stopPropagation();
        };
        window.addEventListener('keypress', (e: KeyboardEvent) => {
            if (this.rebounder.IsShown()) {
                if (e.key === 'Delete') {
                    this.pageState.Remove(this.wnodeActive.value.id);
                    return;
                }
                this.rebounder.handleKey(e);
            }
        });
        this.wnodeActive.rxData.subscribe((next) => {
            if (!next) {
                return;
            }
            if (next.x || next.y || next.w || next.h) {
                const focus = this.wnodeActive.value;
                this.container.style.display = 'block';
                this.container.style.left = `${focus.offsetLeft}px`;
                this.container.style.top = `${focus.offsetTop}px`;
                this.container.style.width = `${focus.offsetWidth}px`;
                this.container.style.height = `${focus.offsetHeight}px`;
            }
        });
    }

    private setMode(mode: EditMode) {
        if (mode === EditMode.None) {
            this.container.style.display = 'none';
            this.rebounder.Hide();
            this.tools.None();
            this.wnodeActive.Visible(true);
            this.wnodeActive.next(null);
        } else if (mode === EditMode.Normal) {
            this.rebounder.Show();
            this.wnodeActive.Visible(true);
            this.tools.Normal(this.wnodeActive.CurrentData);
            if (this.mode === EditMode.Advanced) {
                this.wnodeActive.Commit();
            }
        } else {
            const hasTool = this.tools.Advance(this.wnodeActive.CurrentData);
            if (hasTool) {
                this.rebounder.Hide();
                this.wnodeActive.Visible(false);
            }
        }
        this.mode = mode;
    }

    IsActive(el: HTMLElement) {
        return this.wnodeActive.value === el;
    }

    SetActive(el: HTMLElement) {
        if (el == null) {
            this.setMode(EditMode.None);
            return;
        }
        const current = this.wnodeActive.value;
        if (el !== current) {
            // show current
            this.wnodeActive.Visible(true);
            this.wnodeActive.next(el);
            this.tools.Reset();
            this.setMode(EditMode.Normal);
        }
    }

    SetActiveAndDrag(el: HTMLElement, ev?: MouseEvent) {
        this.SetActive(el);
        this.rebounder.DragTarget(ev);
    }

    Destroy() {
        this.stage.removeEventListener('mousedown', this.onStageMouseDown);
    }
}
