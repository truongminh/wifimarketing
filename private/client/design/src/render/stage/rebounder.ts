import { Context } from "@src/core";
import { GetWNodeActive } from "@render/node";

function NewBall(xSign: 1 | 0 | -1, ySign: 1 | 0 | -1) {
    const ball = document.createElement('div');
    ball.classList.add('toolbox-ball');
    ball.style.position = 'absolute';
    ball.style.width = '6px';
    ball.style.height = '6px';
    ball.style.transform = `translate(-50%,-50%)`;
    ball.style.top = `${(ySign + 1) * 50}%`;
    ball.style.left = `${(xSign + 1) * 50}%`;
    ball.style.backgroundColor = '#fff';
    ball.style.borderRadius = '1px';
    ball.style.zIndex = '1';
    ball.style.border = '1px solid #4169e1';

    if (ySign === 0) {
        ball.style.cursor = 'ew-resize';
    } else if (xSign === 0) {
        ball.style.cursor = 'ns-resize';
    } else if (xSign + ySign === 0) {
        ball.style.cursor = 'nesw-resize';
    } else {
        ball.style.cursor = 'nwse-resize';
    }
    return ball;
}

const balls: Array<[-1 | 0 | 1, -1 | 0 | 1]> = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

interface IBound {
    x: number;
    y: number;
    w: number;
    h: number;
}

const DoubleClickMillisecond = 200;
const LeftMouse = 0;

export class Rebounder {
    private wnodeActive = GetWNodeActive(this.ctx);
    private el = document.createElement('div');
    onDoubleClick = () => { }
    constructor(
        private container: HTMLElement,
        private ctx: Context,
        private bounds: IBound
    ) {
        this.el.style.position = 'absolute';
        this.el.style.display = 'none';
        this.el.style.top = '-2px';
        this.el.style.left = '-2px';
        this.el.style.right = '-2px';
        this.el.style.bottom = '-2px';
        this.el.style.zIndex = '1';
        this.el.style.border = '2px dotted #4169e1';
        this.el.append(...balls.map(b => this.newBall(b[0], b[1])));
        this.el.onmousedown = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.button !== LeftMouse) {
                return;
            }
            this.Show();
            this.DragTarget(e);
        };
        this.el.ondblclick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.Hide();
            this.onDoubleClick();
        }
        this.container.appendChild(this.el);
    }

    IsShown() {
        return this.el.style.display !== 'none';
    }

    Show() {
        this.el.style.display = 'block';
    }

    Hide() {
        this.el.style.display = 'none';
    }

    private moveStep: { [index: string]: IBound } = {
        'ArrowRight': { x: 1, y: 0, w: 0, h: 0 },
        'ArrowLeft': { x: -1, y: 0, w: 0, h: 0 },
        'ArrowDown': { x: 0, y: 1, w: 0, h: 0 },
        'ArrowUp': { x: 0, y: -1, w: 0, h: 0 }
    }

    handleKey(e: KeyboardEvent) {
        const code = e.code;
        const step = this.moveStep[code];
        if (step) {
            this.update(this.getInitial(), step);
        }
    }

    private update(initial: IBound, offset: IBound) {
        const next: IBound = {
            x: initial.x + offset.x,
            y: initial.y + offset.y,
            w: initial.w + offset.w,
            h: initial.h + offset.h
        };
        if (next.h < 0 || next.w < 0) {
            return;
        }
        const maxX = this.bounds.x + this.bounds.w - initial.w / 2;
        if (next.x < 0 || next.x > maxX) {
            return;
        }
        const maxY = this.bounds.y + this.bounds.h - initial.h / 2;
        if (next.y < 0 || next.y > maxY) {
            return;
        }
        this.wnodeActive.Update(next);
    }

    private newBall(xSign: -1 | 0 | 1, ySign: -1 | 0 | 1) {
        const ballElement = NewBall(xSign, ySign);
        ballElement.onmousedown = e => {
            e.preventDefault();
            e.stopPropagation();

            const initial = this.getInitial();
            const offset: IBound = {
                x: 0, y: 0, w: 0, h: 0
            };
            const onmousemove = (ev: MouseEvent) => {
                ev.preventDefault();
                ev.stopPropagation();
                // top and height
                offset.h = ySign * (ev.clientY - e.clientY);
                offset.w = xSign * (ev.clientX - e.clientX);
                offset.y = ySign < 0 ? -offset.h : 0;
                offset.x = xSign < 0 ? -offset.w : 0;
                this.update(initial, offset);
            }

            const onmouseup = (ev: MouseEvent) => {
                ev.preventDefault();
                ev.stopPropagation();
                window.removeEventListener('mousemove', onmousemove);
                window.removeEventListener('mouseup', onmouseup);
                this.wnodeActive.Commit();
            }

            window.addEventListener('mousemove', onmousemove);
            window.addEventListener('mouseup', onmouseup);
        }
        return ballElement;
    }

    private getInitial() {
        const initial: IBound = {
            x: this.el.parentElement.offsetLeft,
            y: this.el.parentElement.offsetTop,
            w: this.el.offsetWidth,
            h: this.el.offsetHeight,
        };
        return initial;
    }

    DragTarget(
        e: { clientX: number, clientY: number }
    ) {

        // get the initla data before first move
        const initial = this.getInitial();
        const offset: IBound = {
            x: 0, y: 0, w: 0, h: 0
        }
        const onmousemove = (ev: MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            this.Hide();
            offset.x = ev.clientX - e.clientX;
            offset.y = ev.clientY - e.clientY;
            this.update(initial, offset);
        }

        const onmouseup = (ev: MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            window.removeEventListener('mousemove', onmousemove);
            window.removeEventListener('mouseup', onmouseup);
            this.Show();
            this.wnodeActive.Commit();
        }

        window.addEventListener('mousemove', onmousemove);
        window.addEventListener('mouseup', onmouseup);
    }
}
