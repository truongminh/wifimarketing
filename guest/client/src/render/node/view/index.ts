
import { NodeTextRender } from './text';
import { INode } from '@src/state';
import { NodeLoginRender } from './login';
import { INodeRender } from './common';
import { NodeImageRender } from './image';
import { Context } from '@src/core';

export function NewRenderer(el: HTMLElement, ctx: Context, node: INode): INodeRender<INode> {
    switch (node.type) {
        case 'login':
            return new NodeLoginRender(el, ctx);
        case 'image':
            return new NodeImageRender(el, ctx);
        case 'text':
        default:
            return new NodeTextRender(el, ctx);
    }
}

export * from './common';
