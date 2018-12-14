import { INode, INodeLogin } from "@src/state";
import { StyleRender, BaseRender } from "./common";

export class NodeLoginRender extends BaseRender {
    Render(el: HTMLElement, value: Partial<INodeLogin>) {
        super.Render(el, value);
        StyleRender(el, value as INode);
        if (value.text) {
            el.textContent = value.text;
        }
        switch (value.auth) {
            case 'facebook':
                el.style.backgroundColor = '#aaa';
                break;
        }
    }
}
