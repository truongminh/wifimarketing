import { INodeText, INode } from "@src/state";
import { BaseRender } from "./common";

export class NodeTextRender extends BaseRender<INodeText> {
    private child = document.createElement('div');
    
    protected init() {
        Object.assign(this.container.style, {
            overflow: 'hidden',
            letterSpacing: '0',
            textDecoration: 'none',
            minWidth: '1px',
            minHeight: '1px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            display: 'table',
        } as CSSStyleDeclaration);
        this.child.style.display = 'table-cell';
        this.container.appendChild(this.child);
    }

    Render(value: Partial<INodeText>) {
        super.Render(value);
        this.ApplyStyle(this.child, value);
        if (value.text) {
            this.child.textContent = value.text;
        }
    }
}

export * from './common';
