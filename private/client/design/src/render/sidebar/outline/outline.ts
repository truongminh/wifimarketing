import { Context, BaseContainer } from "@src/core";
import { GetStageManager } from "@render/stage";
import { GetWNodeActive } from "@render/node";
import { Subscription } from "rxjs";

export class Outline extends BaseContainer {
    private stage = GetStageManager(this.ctx);
    private nodeActive = GetWNodeActive(this.ctx);
    private nodeSubscription: Subscription;

    constructor(
        container: HTMLElement,
        ctx: Context
    ) {
        super(container, ctx);
    }

    Show() {
        const nodes = this.stage.GetAll();
        const lines = nodes.map(node => {
            const div = document.createElement('div');
            div.id = node.id;
            div.classList.add('outline-item');
            div.style.border = '1px solid #ccc';
            div.textContent = node.name;
            div.onclick = () => {
                this.stage.SetActive(div.id);
            }
            return div;
        });
        this.nodeSubscription = this.nodeActive.subscribe(v => {
            lines.forEach(div => {
                if (v && div.id === v.id) {
                    div.classList.add('active');
                } else {
                    div.classList.remove('active');
                }
            });
        });
        this.container.innerHTML = '';
        this.container.append(...lines);
        super.Show();
    }

    Hide() {
        if (this.nodeSubscription) {
            this.nodeSubscription.unsubscribe();
            this.nodeSubscription = null;
        }
        super.Hide();
    }
}
