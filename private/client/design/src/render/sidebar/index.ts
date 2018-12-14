export { RightSidebar } from './rightsidebar';
export { GetStencil } from './stencils';

import { Context } from "@src/core";
import { MenuManager } from "./menu/menu";
import { SidebarContentManager } from './content';

export class SidebarManager {
    private menu = new MenuManager(
        this.el.querySelector('#sidebar-menu'),
        this.ctx
    );
    private content = new SidebarContentManager(
        this.el.querySelector('#sidebar-content'),
        this.ctx
    );

    constructor(
        private el: HTMLElement,
        private ctx: Context
    ) {
        this.menu.onMenuChange = (item) => this.content.Activate(item);
        this.content.Activate('stencils');
    }
}
