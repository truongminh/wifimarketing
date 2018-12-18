import { INodeText, INode, INodeImage } from "@src/state";
import { BaseRender } from "./common";

export class NodeImageRender extends BaseRender<INodeImage> {
    private img = document.createElement('img');

    protected init() {
        Object.assign(this.container.style, {
            overflow: 'hidden',
            minWidth: '1px',
            minHeight: '1px',
            boxSizing: 'border-box',
        } as CSSStyleDeclaration);
        this.img.style.width = '100%';
        this.img.style.height = '100%';
        this.container.appendChild(this.img);
    }

    Render(value: Partial<INodeImage>) {
        super.Render(value);
        this.ApplyStyle(this.container, value);
        if (value.src) {
            this.img.src = value.src;
        }
    }
}

export * from './common';
