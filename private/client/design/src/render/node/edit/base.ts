import { GetWNodeActive } from "../active";
import { Context } from "@src/core";


export interface ITool {
    Show(): void;
    Hide(): void;
    Reset(): void;
}

const ErrShowToolWithoutNode = new Error('show toolbox without active node');

export class BaseTool implements ITool {
    protected wnodeActive = GetWNodeActive(this.ctx);
    protected el = document.createElement('div');

    constructor(private container: HTMLElement, protected ctx: Context) {
        this.el.style.position = 'absolute';
        this.el.style.display = 'none';
        this.container.appendChild(this.el);
    }

    // temporarily hide the toolbox
    // its context remain active
    Show() {
        if (this.wnodeActive.value == null) {
            throw ErrShowToolWithoutNode;
        }
        this.el.style.display = 'block';
        this.Reset();
    }

    Hide() {
        if (this.IsShown()) {
            this.el.style.display = 'none';
        }
    }

    IsShown() {
        return this.el.style.display !== 'none';
    }

    Reset() {

    }
}
