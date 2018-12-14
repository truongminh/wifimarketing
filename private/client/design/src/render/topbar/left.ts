import { Context } from "@src/core";
import { GetContentState, GetPageState } from "@src/state";

export class TopbarLeft {
    private contentState = GetContentState(this.ctx);
    private pageState = GetPageState(this.ctx);
    private contentName = document.createElement('div');
    private pageName = document.createElement('div');

    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
        this.contentName.textContent = this.contentState.value.name;
        this.pageState.subscribe(page => {
            const pageName = page ? page.name : '';
            this.pageName.textContent = pageName;
        });
        this.contentName.classList.add('content-name');
        this.pageName.classList.add('page-name');
        this.container.append(this.contentName, this.pageName);
    }
}
