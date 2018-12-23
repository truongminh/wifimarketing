import { Context, HttpApi } from "@src/core";
import { IFileService } from "./file";
import { GetConfiguration } from "./global";

export class FileServiceBackend implements IFileService {
    private conf = GetConfiguration(this.ctx);
    constructor(
        private ctx: Context
    ) { }


    Link(src: string) {
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return src;
        }
        return `${this.conf.BaseURL}files/${src}`;
    }
}
