import { Context } from "@src/core";

export interface IFileService {
    Link(src: string): string;
}

const fileServiceSymbol = Symbol('file-service');
export function SetFileService(ctx: Context, service: IFileService) {
    ctx[fileServiceSymbol] = service;
}

export function GetFileService(ctx: Context) {
    return ctx[fileServiceSymbol] as IFileService;
}
