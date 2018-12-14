import { Context } from "@src/core";
import { GetFileService } from "@src/service";

export class FilePicker {

    private fileService = GetFileService(this.ctx);
    constructor(
        private ctx: Context
    ) { }

    Show() {
        const input = document.createElement('input');
        input.type = 'file';
        // input.accept = 'image/png, image/jpeg, video/mp4';
        input.click();
        input.onchange = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = input.files[0];
            if (!file) {
                return;
            }
            const { name, size, type, lastModified } = file;
            this.fileService.Upload(file, (p) => {
                console.log(p);
            });
        };
    }
}
