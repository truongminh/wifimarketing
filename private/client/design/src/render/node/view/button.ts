import { INodeText, INode } from "@src/state";
import { StyleRender, BaseRender } from "./common";
 
export class NodeButtonRender extends BaseRender {
    Render(el: HTMLElement, value: Partial<INodeText>) {
        super.Render(el, value);
        StyleRender(el, value as INode);
        el.style.border = '1px solid #000';
        if (value.text) {
            el.textContent = value.text;
        }
    }
}
