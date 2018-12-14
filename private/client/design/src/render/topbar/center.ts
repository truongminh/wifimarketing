import { Context } from "@src/core";

export class TopbarCenter {
    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
        this.container.textContent = 'topbar center';
    }
}
