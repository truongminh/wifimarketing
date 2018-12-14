import { GetWNodeActive } from "@render/stage";
import { Rebounder } from "./rebounder";
import { TextEditor } from "./text";
import { BaseTool } from "./base";
import { Context } from "@src/core";
import { GetPageState } from "@src/state";
import { TextAction } from "./text-action";


type ToolboxName = 'text' | 'rebounder' | 'text-action';

export class ToolboxManager {
    private container: HTMLElement;
    private rebounder: Rebounder;
    private toolMap = new Map<ToolboxName, BaseTool>();
    private onStageMouseDown = (e: MouseEvent) => { };
    private toolbox: ToolboxName[] = [];
    private wnodeActive = GetWNodeActive(this.ctx);
    private pageState = GetPageState(this.ctx);
    get current() {
        return this.wnodeActive.value;
    }

    private showEditTools() {
        const tools: ToolboxName[] = ['text', 'text-action'];
        this.changeToolbox(...tools);
        this.wnodeActive.Visible(false);
    }

    constructor(
        private stage: HTMLElement,
        private ctx: Context
    ) {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.zIndex = '1';
        this.stage.appendChild(this.container);
        this.createTools();
        this.registerEvent();
    }

    private createTools() {
        const div1 = document.createElement('div');
        this.toolMap.set('text', new TextEditor(div1, this.ctx));
        const div2 = document.createElement('div');
        this.toolMap.set('text-action', new TextAction(div2, this.ctx));
        this.container.append(div1, div2);

        const bounds = {
            x: 0,
            y: 0,
            w: this.stage.offsetWidth,
            h: this.stage.offsetHeight
        }
        const reboundContainer = document.createElement('div');
        this.rebounder = new Rebounder(reboundContainer, this.ctx, bounds);
        this.container.append(reboundContainer);
        this.toolMap.set('rebounder', this.rebounder);
    }

    private registerEvent() {
        this.onStageMouseDown = (e: MouseEvent) => {
            if (this.current) {
                if (!this.toolbox.includes('rebounder')) {
                    this.wnodeActive.Visible(true);
                    this.changeToolbox('rebounder');
                    this.wnodeActive.Commit();
                } else {
                    this.SetActive(null);
                }
            }
        };
        this.rebounder.onDoubleClick = () => {
            this.showEditTools();
        }
        this.stage.addEventListener('mousedown', this.onStageMouseDown);
        this.container.onmousedown = (e: MouseEvent) => {
            // do not prevent the default behavior
            e.stopPropagation();
        };
        window.addEventListener('keypress', (e: KeyboardEvent) => {
            if (this.toolbox.includes('rebounder')) {
                if (e.key === 'Delete') {
                    this.pageState.Remove(this.current.id);
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
                const focus = this.current;
                this.container.style.display = 'block';
                this.container.style.left = `${focus.offsetLeft}px`;
                this.container.style.top = `${focus.offsetTop}px`;
                this.container.style.width = `${focus.offsetWidth}px`;
                this.container.style.height = `${focus.offsetHeight}px`;
            }
        });
    }

    IsActive(el: HTMLElement) {
        return this.wnodeActive.value === el;
    }

    SetActive(el: HTMLElement) {
        if (el == null) {
            this.container.style.display = 'none';
            this.changeToolbox();
            this.wnodeActive.next(null);
            return;
        }
        const current = this.current;
        this.wnodeActive.next(el);
        if (el !== current) {
            this.changeToolbox('rebounder');
        }
    }

    SetActiveAndDrag(el: HTMLElement, ev?: MouseEvent) {
        this.SetActive(el);
        this.rebounder.DragTarget(ev);
    }

    Destroy() {
        this.stage.removeEventListener('mousedown', this.onStageMouseDown);
    }

    private changeToolbox(...toolbox: ToolboxName[]) {
        toolbox.forEach((t) => {
            if (!this.toolbox.includes(t)) {
                const tool = this.toolMap.get(t);
                if (tool) {
                    tool.Show();
                }
            }
        });
        this.toolbox.forEach((t) => {
            if (!toolbox.includes(t)) {
                const tool = this.toolMap.get(t);
                if (tool) {
                    tool.Hide();
                }
            }
        });
        this.toolbox = toolbox;
    }
}
