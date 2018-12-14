import { BaseContainer } from "@src/core/container";
import { Context } from "@src/core";
import { GetContentState, GetPageState, IPage } from "@src/state";
import { Subscription } from "rxjs";
import { PageContextMenu } from "./menu";

export class Pages extends BaseContainer {
    private contentState = GetContentState(this.ctx);
    private pageState = GetPageState(this.ctx);
    private subList: Subscription[] = [];
    private pageList = document.createElement('div');
    private pageContextMenu = new PageContextMenu(this.container, this.ctx);

    constructor(
        container: HTMLElement,
        ctx: Context
    ) {
        super(container, ctx);
        const newPage = document.createElement('button');
        newPage.textContent = 'New Page';
        newPage.onclick = () => this.addPage();

        this.container.append(newPage);

        this.container.appendChild(this.pageList);
        this.pageList.oncontextmenu = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.parentElement === this.pageList) {
                e.preventDefault();
                if (target.classList.contains('active')) {
                    this.pageContextMenu.Show(target, target.id);
                }
            }
        }
        this.pageList.onclick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.parentElement === this.pageList) {
                for (let c of this.pageList.children) {
                    if (c === target) {
                        c.classList.add('active');
                        const page = this.contentState.GetPage(c.id);
                        if (page) {
                            this.pageState.SetPage(page);
                        }
                    } else {
                        c.classList.remove('active');
                    }
                }
            };
        }
    }

    private addPage() {
        const page = this.contentState.AddPage();
        this.pageState.SetPage(page);
    }

    private newLine(page: IPage) {
        const div = document.createElement('div');
        div.id = page.id;
        div.classList.add('page-item');
        div.textContent = page.name;
        return div;
    }

    Show() {
        const contentSub = this.contentState.subscribe((content) => {
            this.pageList.innerHTML = '';
            const pages = Object.keys(content.pages).map((id) => content.pages[id]);
            const page_id = this.pageState.value ? this.pageState.value.id : null;
            this.pageList.append(...pages.map(p => {
                const item = this.newLine(p);
                if (item.id === page_id) {
                    item.classList.add('active');
                }
                return item;
            }));
        });
        this.subList.push(contentSub);
        super.Show();
    }

    Hide() {
        //
        while (this.subList.length) {
            this.subList.pop().unsubscribe();
        }
        super.Hide();
    }
}
