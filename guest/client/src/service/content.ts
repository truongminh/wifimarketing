import { IContent } from "@src/state";
import { Context } from "@src/core";

export interface IContentService {
    LoadContent(content_id: string): Promise<IContent>;
}

const contentServiceSymbol = Symbol('content-service');
export function SetContentService(ctx: Context, service: IContentService) {
    ctx[contentServiceSymbol] = service;
}

export function GetContentService(ctx: Context) {
    return ctx[contentServiceSymbol] as IContentService;
}
