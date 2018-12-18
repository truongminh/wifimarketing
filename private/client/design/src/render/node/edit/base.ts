import { GetWNodeActive } from "@render/stage";
import { Context } from "@src/core";


export interface ITool {
    Show(): void;
    Hide(): void;
    IsShown(): boolean;
}

export class BaseTool implements ITool {
    protected wnodeActive = GetWNodeActive(this.ctx);
    protected get wnode() {
        return this.wnodeActive.value;
    }

    constructor(protected el: HTMLElement, protected ctx: Context) {
        this.el.style.position = 'absolute';
        this.el.style.display = 'none';
    }

    // temporarily hide the toolbox
    // its context remain active
    Show() {
        if (this.wnode == null) {
            throw new Error('show toolbox without active node');
        }
        this.el.style.display = 'block';
    }

    Hide() {
        if (this.IsShown()) {
            this.el.style.display = 'none';
        }
    }

    IsShown() {
        return this.el.style.display !== 'none';
    }
}
