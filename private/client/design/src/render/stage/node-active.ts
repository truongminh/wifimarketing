import { BehaviorSubject, Subject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { GetNodeData, UpdateNode } from "@render/node";
import { Context } from "@src/core";
import { GetPageState, INode } from "@src/state"; 

export class NodeActiveSubject extends BehaviorSubject<HTMLElement> {
    private rxUpdate = new Subject<Partial<INode>>();
    rxData = merge(
        this.pipe(map(el => el ? GetNodeData(el) : null)),
        this.rxUpdate
    ) as Observable<Partial<INode>>;
    private pageState = GetPageState(this.ctx);

    constructor(
        private ctx: Context
    ) {
        super(null);
    }

    next(v: HTMLElement) {
        if (this.value && this.value.parentElement) {
            this.Commit();
            this.value.classList.remove('focus');
        }
        if (v) {
            v.classList.add('focus');
        }
        super.next(v);
    }

    Commit() {
        const data = this.CurrentData;
        if (data != null) {
            this.pageState.Update(data);
        }
    }

    Update(next: Partial<INode>) {
        if (this.value != null) {
            UpdateNode(this.value, next);
            this.rxUpdate.next(next);
        }
    }

    Visible(b = false) {
        if (!this.value) {
            return;
        }
        if (b) {
            this.value.style.display = 'table';
        } else {
            this.value.style.display = 'none';
        }
    }

    get CurrentData() {
        return this.value ? GetNodeData(this.value) : null;
    }
}

const wnodeActiveSymbol = Symbol('wnode-active');
export function SetWNodeActive(ctx: Context, nodeManager: NodeActiveSubject) {
    ctx[wnodeActiveSymbol] = nodeManager;
}

export function GetWNodeActive(ctx: Context) {
    return ctx[wnodeActiveSymbol] as NodeActiveSubject;
}
