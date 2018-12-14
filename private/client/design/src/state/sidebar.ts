import { BehaviorSubject } from "rxjs";
import { INode } from "@src/state";
import { Context } from "@src/core";

export interface Icon {
    name: 'stencils' | 'outline' | 'pages' | 'images';
}

export type IStencil = INode & {
    name: string;
}

export class SidebarState {
    constructor(
        public stencils: IStencil[]
    ) {

    }
}

const stateSymbol = Symbol('sidebar-state');
export function SetSibarState(ctx: Context, state: SidebarState) {
    ctx[stateSymbol] = state;
}

export function GetSidebarState(ctx: Context) {
    return ctx[stateSymbol] as SidebarState;
}
