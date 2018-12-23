import { BaseTool } from "./base";
import { Context } from "@src/core";



const style = `
    .richtoolbar {
        transform: translateY(-100%);
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 4px;
        top: -16px;
    }
    .richtoolbar:before {
        border: solid transparent;
        border-top-color: silver;
        border-width: 11px;
        content: " ";
        left: 15px;
        position: absolute;
        top: 100%;
        pointer-event: none;
    }
    .richtoolbar:after {
        border: solid transparent;
        border-top-color: #f5f5f5;
        border-width: 10px;
        left: 16px;
        content: " ";
        position: absolute;
        top: 100%;
        pointer-event: none;
    }
    .rich-text-button.active {
        background: #fff;
        border: 1px solid #bbb;
        color: #006ce5;
        border-radius: 2em;
    }
    .rich-text-button:hover:after {
        content: attr(data-hint);
        box-shadow: 4px 4px 8px rgba(0,0,0,.3);
        text-shadow: 0 -1px 0 #000;
        transform: translateX(-50%);
        background: #383838;
        color: #fff;
        line-height: 12px;
        
        white-space: nowrap;
        pointer-events: none;
        position: absolute;
        transition: .3s ease;
        transition-delay: 0ms;
        z-index: 10;
    }
`;

const html = `
<span>Bold</span>
<span>Italic</span>
<span>Underline</span>
<span>Strike</span>
`

export class TextAction extends BaseTool {
    constructor(container: HTMLElement, ctx: Context) {
        super(container, ctx);
        this.el.classList.add('richtoolbar');
        const s = document.createElement('style');
        s.innerHTML = style;
        this.el.appendChild(s);
        const action = document.createElement('div');
        action.innerHTML = html;
    }
}
