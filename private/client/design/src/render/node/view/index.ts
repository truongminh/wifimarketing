
import { NodeTextRender } from './text';
import { INode } from '@src/state';
import { NodeLoginRender } from './login';
import { INodeRender } from './common';

export function GetRenderer(node: INode): INodeRender {
    switch (node.type) {
        case 'text':
            return new NodeTextRender();
        case 'login':
            return new NodeLoginRender();
        default:
            return new NodeTextRender();
    }
}

export * from './common';
