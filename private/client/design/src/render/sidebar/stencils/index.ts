import { IStencil, GetSidebarState } from "@src/state";
import { Context, BaseContainer } from "@src/core";

const stencilSymbol = Symbol('stencil');

export function GetStencil(el: HTMLElement) {
    return el[stencilSymbol] as IStencil;
}

function setStencil(el: HTMLElement, stencil: IStencil) {
    el[stencilSymbol] = stencil;
}

export class StencilsMenu extends BaseContainer {
    private sidebarState = GetSidebarState(this.ctx);
    constructor(
        container: HTMLElement,
        ctx: Context
    ) {
        super(container, ctx);
        const ul = document.createElement('ul');
        this.sidebarState.stencils.forEach(s => {
            const li = document.createElement('li');
            li.classList.add('stencil');
            setStencil(li, s);
            li.textContent = s.name;
            ul.appendChild(li);
        });
        this.container.append(ul);
    }
}
