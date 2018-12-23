import { BaseTool } from "./base";
import { Context } from "@src/core";
import { INodeText } from "@src/state";
import { ApplyTextStyle } from "../view";


function patchContentEditable(el: HTMLElement) {
    Object.assign(el.style, {
        backgroundColor: '#fff',
        outline: 'none',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 1px #006ce5'
    } as CSSStyleDeclaration);
}

export class TextEditor extends BaseTool {
    constructor(container: HTMLElement, ctx: Context) {
        super(container, ctx);
        this.el.style.top = '0';
        this.el.style.left = '0';
        this.el.style.right = '0';
        this.el.style.bottom = '0';
        this.el.contentEditable = "true";
        this.el.spellcheck = false;
        patchContentEditable(this.el);
        this.el.onkeydown = (e: KeyboardEvent) => {
            e.stopPropagation();
        }
        this.el.onkeyup = (e: KeyboardEvent) => {
            e.stopPropagation();
            this.wnodeActive.Update({ text: this.el.textContent });
        }
    }

    Show() {
        super.Show();
        const data = this.wnodeActive.CurrentData as INodeText;
        this.el.textContent = data.text;
        this.el.style.fontWeight = `${data.fontWeight}`;
        this.el.style.fontFamily = data.fontFamily;
    }
}
