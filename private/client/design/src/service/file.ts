import { Context } from "@src/core";
import { IFile } from "@src/state";

export interface IFileService {
    List(): Promise<IFile[]>;
    Upload(file: File, onprogress?: (p: number) => void): Promise<string>;
}

const fileServiceSymbol = Symbol('file-service');
export function SetFileService(ctx: Context, service: IFileService) {
    ctx[fileServiceSymbol] = service;
}

export function GetFileService(ctx: Context) {
    return ctx[fileServiceSymbol] as IFileService;
}
