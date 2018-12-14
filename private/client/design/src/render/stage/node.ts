import { INode } from "@src/state";
import { GetRenderer, INodeRender } from "@render/node/view";

const dataSymbol = Symbol('node data');

function SetNodeData(el: HTMLElement, data: INode) {
    el[dataSymbol] = { ...data };
}

export function GetNodeData(el: HTMLElement) {
    return el[dataSymbol] as INode;
}

const renderSymbol = Symbol('node render');

export function NewNode(node: INode) {
    const el = document.createElement('div');
    el.id = node.id;
    el.classList.add('node');
    el.style.position = 'absolute';
    const renderer = GetRenderer(node);;
    el[renderSymbol] = renderer;
    renderer.Render(el, node);
    SetNodeData(el, node);
    return el;
}

const pendingUpdateSymbol = Symbol('node pending update');

export function UpdateNode(el: HTMLElement, next: Partial<INode>) {
    const renderer = el[renderSymbol] as INodeRender;
    renderer.Render(el, next);
    Object.assign(el[dataSymbol], next);
    el[pendingUpdateSymbol] = true;
}

export function HasPendingUpdate(el: HTMLElement) {
    return el[pendingUpdateSymbol] as boolean;
}
