
interface Item {
    key: string;
    value: string;
}

export class ContextMenu {
    private menu = document.createElement('ul');
    protected handlers: {[index: string]: () => void} = {};

    constructor(
        private items: Item[]
    ) {
        // this.menu.textContent = 'menu';
        this.menu.style.position = 'fixed';
        this.menu.classList.add('context-menu');
        const children = this.items.map(i => {
            const li = document.createElement('li');
            li.textContent = `${i.value}`;
            li.classList.add('context-menu-item');
            li.onmousedown = (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                const handler = this.handlers[i.key];
                if (handler) {
                    handler();
                }
            }
            return li;
        });
        this.menu.append(...children);
    }

    protected Hide = () => {
        this.menu.remove();
        window.removeEventListener('mousedown', this.Hide);
    }

    protected Attach(host: HTMLElement) {
        const { right, top } = host.getBoundingClientRect();
        this.menu.style.left = `${right + 10}px`;
        this.menu.style.top = `${top}px`;
        document.body.appendChild(this.menu);
        window.addEventListener('mousedown', this.Hide);
    }
}
