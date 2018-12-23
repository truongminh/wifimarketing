import { Subscription } from "rxjs";
import { Context } from "@src/core";
import { INode } from "@src/state";
import { GetWNodeActive } from "@render/node";
import RightSidebarHTML from './right-sidebar.html';
import { InputElement, NewControl } from "./input";

export class RightSidebar {
    private map = new Map<keyof INode, InputElement[]>();
    private updateSubscription: Subscription;
    private wnodeActive = GetWNodeActive(this.ctx);

    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
        this.container.innerHTML = RightSidebarHTML;
        this.container.querySelectorAll('[x-control]').forEach((el: HTMLElement) => {
            const controlName = el.getAttribute('x-control') as keyof INode;
            const control = NewControl(el, this.ctx);
            if (control && controlName) {
                const controls = this.map.get(controlName) || [];
                controls.push(control);
                this.map.set(controlName, controls);
                control.onValueChange = (value, commit = true) => {
                    const wnode = this.wnodeActive.value;
                    if (wnode) {
                        this.wnodeActive.Update({ [controlName]: value });
                        if (commit) {
                            this.wnodeActive.Commit();
                        }
                    }
                }
            }
        });
        this.registerEvent();
    }

    private registerEvent() {
        this.updateSubscription = this.wnodeActive.rxData.subscribe((next) => {
            if (!next) {
                this.clearValues();
            } else {
                this.updateValues(next);
            }
        });
    }

    Destroy() {
        this.updateSubscription.unsubscribe();
    }

    private updateValues(patch: Partial<INode>) {
        this.map.forEach((controls, key) => {
            if (patch[key] !== undefined) {
                controls.forEach(c => c.setValue(patch[key]));
            }
        });
    }

    private clearValues() {
        this.map.forEach(controls => {
            controls.forEach(c => c.setValue(''));
        });
    }
}
