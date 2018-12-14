import { Context, ContextMenu } from "@src/core";
import { GetContentState } from "@src/state";

export class PageContextMenu extends ContextMenu {
    private contentState = GetContentState(this.ctx);

    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
        super([
            { key: 'rename', value: 'Rename' },
            { key: 'delete', value: 'Delete' }
        ]);
    }

    Show(host: HTMLElement, page_id: string) {
        const page = this.contentState.GetPage(page_id);
        this.Attach(host);
        this.handlers['delete'] = () => {
            const ok = confirm(`Delete page ${page.name}?`);
            if (ok) {
                this.contentState.RemovePage(page.id);
            }
            this.Hide();
        }
        this.handlers['rename'] = () => {
            const s = prompt('Page name', page.name);
            if (s) {
                this.contentState.UpdatePage(page.id, { name: s });
            }
            this.Hide();
        }
    }
}
