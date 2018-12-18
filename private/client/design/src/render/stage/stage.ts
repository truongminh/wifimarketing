import { Subscription } from "rxjs";
import { Context } from "@src/core";
import { GetPageState, IPage, INodeDiff, INode } from "@src/state";
import { GetStencil } from "@render/sidebar";
import { GetNodeData, NewNode } from "./node";
import { ToolboxContainer } from "./toolbox";

export class StageManager {
    private pageState = GetPageState(this.ctx);
    private subList: Subscription[] = [];
    private toolbox: ToolboxContainer;
    private nodes = new Map<string, HTMLElement>();
    private holder = document.createElement('div');

    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
        this.toolbox = new ToolboxContainer(this.container, this.ctx);
        this.container.append(this.holder);

        this.subList.push(this.pageState.rxNodeDiff.subscribe(diff => {
            this.handleDiff(diff);
        }), this.pageState.subscribe((page) => {
            this.Reset(page);
        }));
        window.addEventListener('mousedown', (e: MouseEvent) => {
            this.handleMouseDown(e);
        });
    }

    Destroy() {
        while (this.subList.length) {
            this.subList.pop().unsubscribe();
        }
    }

    GetAll() {
        return [...this.nodes.values()]
            .map(GetNodeData).filter(c => c != null);
    }

    SetActive(id: string) {
        const el = this.nodes.get(id);
        if (el) {
            this.toolbox.SetActive(el);
        }
    }

    private Reset(page: IPage) {
        this.nodes.forEach(n => n.remove());
        this.nodes.clear();
        this.toolbox.SetActive(null);
        if (!page || !page.nodes) {
            return;
        }
        Object.keys(page.nodes).forEach((nid) => {
            this.addNode(page.nodes[nid]);
        });
    }

    private addNode(node: INode) {
        const el = NewNode(node);
        this.container.appendChild(el);
        this.nodes.set(node.id, el);
        el.onmousedown = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button !== 0) {
                return;
            }
            // left mouse
            this.toolbox.SetActiveAndDrag(el, e);
        };
        return el;
    }

    private handleDiff({ added, removed, updated }: INodeDiff) {
        if (added) {
            this.toolbox.SetActive(this.addNode(added));
        }
        if (removed) {
            const element = this.nodes.get(removed.id);
            if (element) {
                this.container.removeChild(element);
                if (this.toolbox.IsActive(element)) {
                    this.toolbox.SetActive(null);
                }
            }
        }
    }

    private handleMouseDown(e: MouseEvent) {
        const target = e.target as HTMLElement;
        const stencil = GetStencil(target);
        if (!stencil) {
            return;
        }
        const rect = this.container.getBoundingClientRect();
        this.holder.textContent = target.textContent;
        this.holder.style.top = `${e.clientY}px`;
        this.holder.style.left = `${e.clientX}px`;
        this.holder.style.position = 'fixed';
        this.holder.style.display = 'block';
        const onmousemove = (ev: MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            this.holder.style.top = `${ev.clientY}px`;
            this.holder.style.left = `${ev.clientX}px`;
        }
        const onmouseup = (ev: MouseEvent) => {
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;
            const w = this.holder.offsetWidth;
            const h = this.holder.offsetHeight;

            this.holder.textContent = '';
            this.holder.style.display = 'none';

            if (x > 0 && y > 0) {
                this.pageState.Add({
                    x, y, w, h,
                    ...stencil
                } as INode);
            }
            window.removeEventListener('mousemove', onmousemove);
            window.removeEventListener('mouseup', onmouseup);
        }
        window.addEventListener('mousemove', onmousemove);
        window.addEventListener('mouseup', onmouseup);
    }
}

const stageManagerSymbol = Symbol('stage-manager');
export function SetStageManager(ctx: Context, state: StageManager) {
    ctx[stageManagerSymbol] = state;
}

export function GetStageManager(ctx: Context) {
    return ctx[stageManagerSymbol] as StageManager;
}
