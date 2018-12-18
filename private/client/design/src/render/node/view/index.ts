
import { NodeTextRender } from './text';
import { INode } from '@src/state';
import { NodeLoginRender } from './login';
import { INodeRender } from './common';
import { NodeImageRender } from './image';

export function NewRenderer(el: HTMLElement, node: INode): INodeRender<INode> {
    switch (node.type) {
        case 'login':
            return new NodeLoginRender(el);
        case 'image':
            return new NodeImageRender(el);
        case 'text':
        default:
            return new NodeTextRender(el);
    }
}

export * from './common';
