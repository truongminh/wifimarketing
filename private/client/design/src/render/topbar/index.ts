import { Context } from "@src/core";
import { Logo } from "./logo";
import { TopbarLeft } from "./left";
import { TopbarCenter } from "./center";
import { TopbarRight } from "./right";

export class Topbar {
    private logo = new Logo(this.container.querySelector('#logo'));
    private left = new TopbarLeft(
        this.container.querySelector('#topbar-left'),
        this.ctx
    );
    private center = new TopbarCenter(
        this.container.querySelector('#topbar-center'),
        this.ctx
    );
    private right = new TopbarRight(this.container.querySelector('#topbar-right'));
    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
    }
}
