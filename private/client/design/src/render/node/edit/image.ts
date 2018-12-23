import { BaseTool } from "./base";
import { Context } from "@src/core";
import { INodeImage, IFile } from "@src/state";
import { GetFileService } from "@src/service";

export class ImageEditor extends BaseTool {
    private img = document.createElement('img');
    private src = document.createElement('div');
    private link = document.createElement('input');
    private status = document.createElement('div');
    private fileService = GetFileService(this.ctx);

    constructor(container: HTMLElement, ctx: Context) {
        super(container, ctx);
        this.el.style.width = '100%';
        this.el.style.height = '100%';
        this.img.style.width = '100%';
        this.img.style.height = '100%';
        this.src.style.width = '100%';
        this.status.style.position = 'absolute';
        this.status.style.top = '0';
        this.status.style.backgroundColor = '#00000066';
        this.status.style.width = '100%';
        this.status.style.height = '100%';
        this.status.style.display = 'none';
        this.el.append(this.img, this.status, this.src);
        this.addSrc();
    }

    Reset() {
        const data = this.wnodeActive.CurrentData as INodeImage;
        this.img.src = this.fileService.Link(data.src);
        this.link.value = data.src;
    }

    private addSrc() {
        const cancel = document.createElement('button');
        cancel.onclick = () => this.Reset();
        cancel.textContent = 'Cancel';

        this.link.style.width = '100%';
        this.link.oninput = () => {
            this.img.src = this.link.value;
        };

        const upload = document.createElement('button');
        upload.textContent = 'Upload';
        upload.onclick = () => this.showUpload();

        this.src.append(this.link, cancel, upload);

    }

    private showMessage(msg: string) {
        console.log(msg);
        this.status.textContent = msg;
    }

    private showUpload() {
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
            this.status.style.display = 'block';
            this.showMessage(`Uploading ${file.name} ... `);
            this.fileService.Upload(file, (loaded, total) => {
                const p = total === 0 ? 0 : (loaded / total) * 100;
                this.showMessage(`File ${file.name} ${p.toFixed(2)}%`);
            }).then((data) => {
                this.status.style.display = 'none';
                this.status.textContent = '';
                const f = JSON.parse(data) as IFile;
                const src = this.fileService.Link(f.path);
                this.img.src = src;
                this.link.value = f.path;
            }).catch((e) => {
                this.showMessage(`File ${file.name} error ${e.message}`);
            });
        };
    }

    Hide() {
        super.Hide();
        this.wnodeActive.Update({ src: this.link.value });
        console.log('hide');
        this.link.value = '';
        this.img.src = '';
    }
}
