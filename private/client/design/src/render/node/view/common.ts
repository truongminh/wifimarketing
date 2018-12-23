import { INode } from "@src/state";
import { Context } from "@src/core";

interface IPosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface INodeRender<T extends INode> {
    Render(next: Partial<T>);
}

export class BaseRender<T extends INode> implements INodeRender<T> {
    protected inited = false;

    constructor(
        protected container: HTMLElement,
        protected ctx: Context
    ) {

    }

    protected init() {

    }

    Render(next: Partial<T>) {
        if (!this.inited) {
            this.init();
            this.inited = true;
        }
        PositionRender(this.container, next);
    }
}

function PositionRender(el: HTMLElement, next: Partial<IPosition>) {
    if (next.x) {
        el.style.left = `${next.x}px`;
    }
    if (next.y) {
        el.style.top = `${next.y}px`;
    }
    if (next.w) {
        el.style.width = `${next.w}px`;
    }
    if (next.h) {
        el.style.height = `${next.h}px`;
    }
}

export function ApplyTextStyle<T extends INode>(el: HTMLElement, next: Partial<T>) {
    // el.style['overflowWrap'] = 'break-word';
    if (next.fontWeight !== undefined) {
        el.style.fontWeight = `${next.fontWeight}`;
    }
    if (next.fontFamily) {
        el.style.fontFamily = next.fontFamily;
    }
    if (next.textAlign) {
        el.style.textAlign = next.textAlign;
    }
    if (next.verticalAlign) {
        el.style.verticalAlign = next.verticalAlign;
    }
    if (next.color) {
        el.style.color = next.color;
    }
    if (next.fontSize) {
        el.style.fontSize = `${next.fontSize}px`;
    }
    if (next.fontStyle !== undefined) {
        el.style.fontStyle = next.fontStyle;
    }
    if (next.textDecoration !== undefined) {
        el.style.textDecoration = next.textDecoration;
    }
    if (next.backgroundColor !== undefined) {
        el.style.backgroundColor = next.backgroundColor;
    }
}
