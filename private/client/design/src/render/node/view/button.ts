import { INodeButton } from "@src/state";
import { BaseRender } from "./common";

export class NodeButtonRender extends BaseRender<INodeButton> {
    Render(value: Partial<INodeButton>) {
        super.Render(value);
        this.ApplyStyle(this.container, value);
        this.container.style.border = '1px solid #000';
        if (value.text) {
            this.container.textContent = value.text;
        }
    }
}
