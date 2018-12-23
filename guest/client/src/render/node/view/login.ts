import { INode, INodeLogin } from "@src/state";
import { BaseRender, ApplyTextStyle } from "./common";

export class NodeLoginRender extends BaseRender<INodeLogin> {
    Render(value: Partial<INodeLogin>) {
        super.Render(value);
        ApplyTextStyle(this.container, value);
        if (value.text) {
            this.container.textContent = value.text;
        }
        switch (value.auth) {
            case 'facebook':
                this.container.style.backgroundColor = '#aaa';
                break;
        }
    }
}
