
import { INode } from "@src/state";
import { NewRenderer, INodeRender } from "./view";
import { Context } from "@src/core";

const dataSymbol = Symbol('node data');

function SetNodeData(el: HTMLElement, data: INode) {
    el[dataSymbol] = { ...data };
}

export function GetNodeData(el: HTMLElement) {
    return el[dataSymbol] as INode;
}

const renderSymbol = Symbol('node render');

export function NewNode(node: INode, ctx: Context) {
    const el = document.createElement('div');
    el.id = node.id;
    el.classList.add('node');
    el.style.position = 'absolute';
    const renderer = NewRenderer(el, ctx, node);;
    el[renderSymbol] = renderer;
    renderer.Render(node);
    SetNodeData(el, node);
    return el;
}

const pendingUpdateSymbol = Symbol('node pending update');

export function UpdateNode(el: HTMLElement, next: Partial<INode>) {
    const renderer = el[renderSymbol] as INodeRender<INode>;
    renderer.Render(next);
    Object.assign(el[dataSymbol], next);
    el[pendingUpdateSymbol] = true;
}
