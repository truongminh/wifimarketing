import { IContent, IPageDiff } from "@src/state";
import { Context } from "@src/core";
import { IPage, INodeDiff } from "@src/state";

export interface IContentService {
    CreateContent(content_name: string): Promise<string>;
    LoadContent(content_id: string): Promise<IContent>;
    HandlePageDiff(content_id: string, diff: IPageDiff): Promise<number>;
    HandleNodeDiff(content_id: string, page_id: string, diff: INodeDiff): Promise<number>;
}

const contentServiceSymbol = Symbol('content-service');
export function SetContentService(ctx: Context, service: IContentService) {
    ctx[contentServiceSymbol] = service;
}

export function GetContentService(ctx: Context) {
    return ctx[contentServiceSymbol] as IContentService;
}
