import { INode } from "@src/state";
import { ITool } from "./base";
import { TextEditor } from "./text";
import { Context } from "@src/core";
import { TextAction } from "./text-action";
import { ImageEditor } from "./image";

export const enum ToolName {
    Text,
    TextAction,
    Image
}

function GetNormalTools(node: INode): ToolName[] {
    return [];
}

function GetAdvancedTools(node: INode): ToolName[] {
    switch (node.type) {
        case 'text':
        case 'login':
            return [ToolName.Text, ToolName.TextAction];
        case 'image':
            return [ToolName.Image];
    }
    return [];
}

interface IToolMaker {
    new(el: HTMLElement, ctx: Context): ITool;
}

const Maker = new Map<ToolName, IToolMaker>();
Maker.set(ToolName.Text, TextEditor);
Maker.set(ToolName.TextAction, TextAction);
Maker.set(ToolName.Image, ImageEditor);


export class Toolboxes {
    private tools = new Map<ToolName, ITool>();
    private shown: ToolName[] = [];

    constructor(
        private container: HTMLElement,
        private ctx: Context
    ) {
        Maker.forEach((v, k) => {
            this.tools.set(k, new v(this.container, this.ctx));
        });
    }

    /**
     * None: show no tool
     */
    None() {
        this.changeToolbox();
    }

    /**
     * Normal: show normal tools
     * return false if no tool is shown
     * @param node 
     */
    Normal(node: INode) {
        const values = GetNormalTools(node);
        this.changeToolbox(values);
        return values && values.length > 0;
    }

    /**
     * Advance: show advanced toosl
     * return false if no tool is shown
     * @param node 
     */
    Advance(node: INode) {
        const values = GetAdvancedTools(node);
        this.changeToolbox(values);
        return values && values.length > 0;
    }

    Reset() {
        this.shown.forEach(t => {
            const tool = this.tools.get(t);
            if (tool) {
                tool.Reset();
            }
        });
    }

    private changeToolbox(toolbox: ToolName[] = []) {
        this.shown.forEach(t => {
            if (toolbox.indexOf(t) === -1) {
                const tool = this.tools.get(t);
                if (tool) {
                    tool.Hide();
                }
            }
        });
        toolbox.forEach((t) => {
            if (this.shown.indexOf(t) === -1) {
                const tool = this.tools.get(t);
                if (tool) {
                    tool.Show();
                }
            }
        });
        this.shown = [...toolbox];
    }
}
