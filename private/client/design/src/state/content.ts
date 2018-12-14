import { IPage } from "./page";
import { Context } from "@src/core";
import { Subject, BehaviorSubject } from "rxjs";

export interface IContent {
    id: string;
    name: string;
    pages: { [index: string]: IPage };
}

export interface IPageDiff {
    added?: IPage;
    removed?: IPage;
    updated?: IPage;
}

export class ContentState extends BehaviorSubject<IContent> {
    rxPageDiff = new Subject<IPageDiff>();
    constructor(
        content: IContent
    ) {
        super(content);
    }

    GetPage(id: string) {
        return this.value.pages[id];
    }

    AddPage() {
        const pageCount = Object.keys(this.value.pages).length;
        const name = `Page ${pageCount + 1}`;
        const page: IPage = {
            id: Math.random().toString(36).substr(3, 6),
            name, nodes: {}
        };
        this.value.pages[page.id] = page;
        setTimeout(() => {
            this.next(this.value);
        });
        this.rxPageDiff.next({ added: page });
        return page;
    }

    RemovePage(page_id: string) {
        delete this.value.pages[page_id];
        setTimeout(() => {
            this.next(this.value);
        });
        this.rxPageDiff.next({ removed: this.GetPage(page_id) });
    }

    UpdatePage(page_id: string, data: Partial<IPage>) {
        Object.assign(this.value.pages[page_id], data);
        setTimeout(() => {
            this.next(this.value);
        });
        this.rxPageDiff.next({ updated: this.GetPage(page_id) });
    }
}

const contentStateSymbol = Symbol('content-state');
export function SetContentState(ctx: Context, state: ContentState) {
    ctx[contentStateSymbol] = state;
}

export function GetContentState(ctx: Context) {
    return ctx[contentStateSymbol] as ContentState;
}
