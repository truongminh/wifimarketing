import * as menuHtml from './menu.html';
import { Context } from '@src/core';

export class MenuManager {
    onMenuChange = (menu: string) => {}
    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) { 
        this.container.innerHTML = menuHtml;
        this.container.querySelectorAll('[value]').forEach((el: HTMLElement) => {
            el.onclick = (e: MouseEvent) => {
                this.onMenuChange(el.getAttribute('value'));
            }
        });
    }
}
