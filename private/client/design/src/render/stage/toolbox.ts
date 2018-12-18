import { GetWNodeActive } from "@render/stage";
import { Rebounder } from "./rebounder";
import { Context } from "@src/core";
import { GetPageState } from "@src/state";
import { Toolboxes } from "@render/node/edit";

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
        const reboundContainer = document.createElement('div');
        const rebounder = new Rebounder(reboundContainer, this.ctx, bounds);
        this.container.append(reboundContainer);
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
            this.wnodeActive.next(null);
            this.tools.None();
        } else if (mode === EditMode.Normal) {
            this.wnodeActive.Visible(true);
            if (this.mode === EditMode.Advanced) {
                this.wnodeActive.Commit();
            }
            this.rebounder.Show();
            this.tools.Normal(this.wnodeActive.CurrentData);
        } else {
            this.rebounder.Hide();
            this.wnodeActive.Visible(false);
            this.tools.Advance(this.wnodeActive.CurrentData);
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
        this.wnodeActive.next(el);
        if (el !== current) {
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
