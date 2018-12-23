import colorHtml from './color.html';

function hex2rgb(hex: string) {
    return [
        parseInt(hex.substr(1, 2), 16),
        parseInt(hex.substr(3, 2), 16),
        parseInt(hex.substr(5, 2), 16)
    ];
}

export class ColorPicker {

    private container = (() => {
        const div = document.createElement('div');
        div.innerHTML = colorHtml;
        div.style.zIndex = '10';
        div.style.position = 'fixed';
        div.onmousedown = div.onclick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
        }
        return div;
    })();
    onChange = (rgba: string) => { };

    private colorBlock = this.container.querySelector('#color-block') as HTMLCanvasElement;
    private colorStrip = this.container.querySelector('#color-strip') as HTMLCanvasElement;
    private colorLabel = this.container.querySelector('#color-label') as HTMLElement;
    private rgb: number[] = [255, 0, 0];
    private ctxBlock = this.colorBlock.getContext('2d');
    private ctxStrip = this.colorStrip.getContext('2d');

    constructor() {
        this.ctxBlock.rect(0, 0, this.colorBlock.width, this.colorBlock.height);
        this.fillGradient();
        this.ctxStrip.rect(0, 0, this.colorStrip.width, this.colorStrip.height);
        const grd1 = this.ctxStrip.createLinearGradient(0, 0, 0, this.colorBlock.height);
        grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
        grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
        this.ctxStrip.fillStyle = grd1;
        this.ctxStrip.fill();
        this.colorStrip.onclick = (e: MouseEvent) => {
            const x = e.offsetX;
            const y = e.offsetY;
            const [r, g, b] = this.ctxStrip.getImageData(x, y, 1, 1).data;
            this.rgb = [r, g, b];
            this.adjust();
            this.fillGradient();
        }

        this.enableDrag(this.colorBlock, e => {
            const x = e.offsetX;
            const y = e.offsetY;
            const [r, g, b] = this.ctxBlock.getImageData(x, y, 1, 1).data;
            this.rgb = [r, g, b];
            this.adjust();
            this.onChange(this.hex);
        });
    }

    set hex(v: string) {
        this.rgb = hex2rgb(v);
        this.adjust();
    }

    get hex() {
        const [r, g, b] = this.rgb;
        const hex = "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
        return hex;
    }

    private get rgba() {
        const [r, g, b] = this.rgb;
        const rgba = `rgba(${r},${g},${b},1)`;
        return rgba;
    }

    private adjust() {
        this.colorLabel.style.backgroundColor = this.rgba;
    }

    Show(host: HTMLElement) {
        document.body.appendChild(this.container);
    }

    Hide() {
        this.container.remove();
    }

    private enableDrag(el: HTMLElement, callback: (e: MouseEvent) => void) {
        let drag = false;
        el.onmousedown = (e) => { drag = true; callback(e); }
        el.onmousemove = (e) => { if (drag) { callback(e); } }
        el.onmouseup = (e) => drag = false;
    }

    private fillGradient() {
        const width = this.colorBlock.width;
        const height = this.colorBlock.height;
        const ctx1 = this.ctxBlock;
        const ctx2 = this.ctxStrip;

        ctx1.fillStyle = this.rgba;
        ctx1.fillRect(0, 0, width, height);

        const grdWhite = ctx2.createLinearGradient(0, 0, width, 0);
        grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
        grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
        ctx1.fillStyle = grdWhite;
        ctx1.fillRect(0, 0, width, height);

        const grdBlack = ctx2.createLinearGradient(0, 0, 0, height);
        grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
        grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
        ctx1.fillStyle = grdBlack;
        ctx1.fillRect(0, 0, width, height);
    }
}


