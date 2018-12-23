import { Context } from "@src/core";
import { NewNode } from "@render/node";
import { IPage, INode, GetContentState } from "@src/state";

export class StageManager {
    private nodes = new Map<string, HTMLElement>();
    private contentState = GetContentState(this.ctx);

    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
        this.contentState.RegisterPageChangeCallback(p => this.Reset(p));
    }

    private Reset(page: IPage) {
        this.nodes.forEach(n => n.remove());
        this.nodes.clear();
        if (!page || !page.nodes) {
            return;
        }
        Object.keys(page.nodes).forEach((nid) => {
            this.addNode(page.nodes[nid]);
        });
        console.log(page);
    }

    private addNode(node: INode) {
        const el = NewNode(node, this.ctx);
        this.container.appendChild(el);
        this.nodes.set(node.id, el);
        return el;
    }
}

const stageManagerSymbol = Symbol('stage-manager');
export function SetStageManager(ctx: Context, state: StageManager) {
    ctx[stageManagerSymbol] = state;
}

export function GetStageManager(ctx: Context) {
    return ctx[stageManagerSymbol] as StageManager;
}
