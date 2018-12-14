import { Context } from "./context";

export class BaseContainer {
    constructor(protected container: HTMLElement, protected ctx: Context) {
        this.container.style.position = 'absolute';
        this.container.style.display = 'none';
    }

    get isShown() {
        return this.container.style.display === 'block';
    }

    Show() {
        this.container.style.display = 'block';
        this.container.classList.add('active');
    }

    Hide() {
        if (this.container.style.display !== 'none') {
            this.container.style.display = 'none';
            this.container.classList.remove('active');
        }
    }
}
