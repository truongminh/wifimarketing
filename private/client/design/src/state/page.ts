import { Subject, BehaviorSubject } from "rxjs";
import { Context } from "@src/core";
import { INode } from "@src/state";


export interface IPage {
    id: string;
    name: string;
    nodes: { [index: string]: INode };
}

export interface INodeDiff {
    added?: INode;
    removed?: INode;
    updated?: { id: string, next: Partial<INode>, prev: Partial<INode> };
}

export class PageState extends BehaviorSubject<IPage> {
    rxNodeDiff = new Subject<INodeDiff>();
    private get nodes() {
        return this.value.nodes;
    }

    constructor() {
        super(null);
    }

    SetPage(page: IPage) {
        this.next(page);
    }

    private logDiff(id: string, node: Partial<INode>, message: string) {
        const arr = Object.keys(node).map(k => `${k}:${node[k]}`);
        console.log(message, id, `<${arr.join(';')}>`);
    }

    Add(value: Partial<INode>) {
        if (!this.value) {
            console.log('no current page');
            return;
        }
        const id = Math.random().toString(36).substr(3, 6);
        const focus = { id, ...value } as INode;
        this.nodes[focus.id] = focus;
        this.logDiff(id, focus, 'add');
        this.rxNodeDiff.next({
            added: { ...focus },
        });
    }

    Update(updateValue: Partial<INode>) {
        const id = updateValue.id;
        const oldNode = this.nodes[id];
        if (!oldNode) {
            console.error('update unknown id', id);
            return;
        };
        const next: Partial<INode> = {};
        const prev: Partial<INode> = {};
        Object.keys(oldNode).concat(Object.keys(updateValue)).forEach((k) => {
            if (updateValue[k] === oldNode[k]) {
                return;
            }
            if (updateValue[k] !== undefined) {
                next[k] = updateValue[k];
            }
            if (oldNode[k] !== undefined) {
                prev[k] = oldNode[k];
            }
        });
        if (Object.keys(next).length > 0) {
            this.logDiff(id, next, 'update');
            const newNode = { ...oldNode, ...updateValue } as INode;
            this.nodes[id] = newNode;
            this.rxNodeDiff.next({
                updated: { id, next, prev },
            });
        }
    }

    Remove(id: string) {
        const node = this.nodes[id];
        if (node) {
            delete this.nodes[id];
            this.rxNodeDiff.next({ removed: node });
            this.logDiff(id, {}, 'remove');
        }
    }
}

const pageStateSymbol = Symbol('page-state');
export function SetPageState(ctx: Context, state: PageState) {
    ctx[pageStateSymbol] = state;
}

export function GetPageState(ctx: Context) {
    return ctx[pageStateSymbol] as PageState;
}
