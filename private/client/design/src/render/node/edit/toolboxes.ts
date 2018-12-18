import { INode } from "@src/state";
import { ITool } from "./base";
import { TextEditor } from "./text";
import { Context } from "@src/core";
import { TextAction } from "./text-action";

export const enum ToolName {
    Text,
    TextAction,
    Image
}

function GetNormalTools(node: INode): ToolName[] {
    switch (node.type) {
        case 'text':
        case 'login':
            return [];
        case 'image':
            return [ToolName.Image];
    }
}

function GetAdvancedTools(node: INode): ToolName[] {
    switch (node.type) {
        case 'text':
        case 'login':
            return [ToolName.Text, ToolName.TextAction];
        case 'image':
            return [ToolName.Image];
    }
}

export class Toolboxes {
    private tools = new Map<ToolName, ITool>();

    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
        const div1 = document.createElement('div');
        this.tools.set(ToolName.Text, new TextEditor(div1, this.ctx));
        const div2 = document.createElement('div');
        this.tools.set(ToolName.TextAction, new TextAction(div2, this.ctx));
        this.container.append(div1, div2);
    }

    None() {
        this.changeToolbox();
    }

    Normal(node: INode) {
        this.changeToolbox(GetNormalTools(node));
    }

    Advance(node: INode) {
        this.changeToolbox(GetAdvancedTools(node));
    }

    private changeToolbox(toolbox: ToolName[] = []) {
        this.tools.forEach(t => t.Hide());
        toolbox.forEach((t) => {
            const tool = this.tools.get(t);
            if (tool) {
                tool.Show();
            }
        });
    }
}
