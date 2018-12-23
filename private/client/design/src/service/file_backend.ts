import { Context, HttpApi } from "@src/core";
import { IFile } from "@src/state";
import { IFileService } from "./file";
import { GetConfiguration } from "./global";

export class FileServiceBackend implements IFileService {
    private conf = GetConfiguration(this.ctx);
    private baseUrl = `${this.conf.BaseURL}api/files`;
    private api = new HttpApi(this.baseUrl);
    constructor(
        private ctx: Context
    ) { }

    async List() {
        return this.api.Get<IFile[]>('');
    }

    async Upload(file: File, onprogress: (loaded: number, total: number) => void) {
        const form = new FormData();
        form.set('file', file);
        return HttpApi.Upload(this.baseUrl, form, onprogress);
    }
    
    Link(src: string) {
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return src;
        }
        return `${this.conf.BaseURL}files/${src}`;
    }
}
