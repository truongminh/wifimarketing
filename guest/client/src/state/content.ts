import { INode } from "./node";
import { Context } from "@src/core";

export interface IPage {
    id: string;
    name: string;
    nodes: { [index: string]: INode };
}

export interface IContent {
    id: string;
    name: string;
    pages: { [index: string]: IPage };
}


export class ContentState {
    private _onPageChange = (p: IPage) => {};
    private activePage: IPage = null;
    constructor(
        private content: IContent
    ) {
        const pages = Object.keys(this.content.pages);
        this.activePage = this.content.pages[pages[0]];
    }

    RegisterPageChangeCallback(callback: (p: IPage) => void) {
        this._onPageChange = callback;
        this._onPageChange(this.activePage);
    }

}

const contentStateSymbol = Symbol('content-state');
export function SetContentState(ctx: Context, state: ContentState) {
    ctx[contentStateSymbol] = state;
}

export function GetContentState(ctx: Context) {
    return ctx[contentStateSymbol] as ContentState;
}

