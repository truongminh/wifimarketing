import { BaseContainer, Context } from "@src/core";
import { StencilsMenu } from "./stencils";
import { Outline } from "./outline/outline";
import { Pages } from "./pages/pages";

export class SidebarContentManager {
    private map = new Map<string, BaseContainer>();
    constructor(
        private el: HTMLElement,
        private ctx: Context
    ) {
        const div1 = document.createElement('div');
        this.map.set('stencils', new StencilsMenu(div1, this.ctx));
        const div2 = document.createElement('div');
        this.map.set('outline', new Outline(div2, this.ctx));
        const div3 = document.createElement('div');
        this.map.set('pages', new Pages(div3, this.ctx));
        this.el.append(div1, div2, div3);
    }

    Activate(item: string) {
        this.map.forEach((container, key) => {
            if (item === key) {
                if (!container.isShown) {
                    container.Show();
                }
            } else {
                container.Hide();
            }
        });
    }
}
