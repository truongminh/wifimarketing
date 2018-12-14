import { INodeText, INode } from "@src/state";
import { StyleRender, BaseRender } from "./common";


const renderSymbol = Symbol('render');

interface IRenderContext {

}

function getRenderContext(el: HTMLElement) {
    return el[renderSymbol] as IRenderContext;
}

function initRenderContext(el: HTMLElement, fn: () => IRenderContext) {
    if (el[renderSymbol]) {
        return;
    }
    el[renderSymbol] = fn();
}

export class NodeTextRender extends BaseRender {
    Render(el: HTMLElement, value: Partial<INodeText>) {
        initRenderContext(el, () => {
            Object.assign(el.style, {
                overflow: 'hidden',
                letterSpacing: '0',
                textDecoration: 'none',
                minWidth: '1px',
                minHeight: '1px',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                display: 'table',
            } as CSSStyleDeclaration);
            return {};
        });
        super.Render(el, value);
        if (!el.firstChild) {
            let child = document.createElement('div');
            el.appendChild(child);
            child.style.display = 'table-cell';
        }
        const child = el.firstChild as HTMLElement;
        StyleRender(child, value as INode);
        if (value.text) {
            child.textContent = value.text;
        }
    }
}

export * from './common';
