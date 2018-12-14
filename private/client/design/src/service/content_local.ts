import { IContentService } from "./content";
import { IContent, IPageDiff } from "@src/state";
import { INodeDiff } from "@src/state";
import { Context } from "@src/core";

export class ContentServiceLocalStorage implements IContentService {
    private read(content_id: string): IContent {
        return JSON.parse(localStorage.getItem(`__content_${content_id}`));
    }
    private save(content: IContent) {
        const key = `__content_${content.id}`;
        localStorage.setItem(key, JSON.stringify(content));
    }

    constructor(
        private ctx: Context
    ) {}

    async CreateContent(name: string) {
        const id = Math.random().toString(36).substr(3, 6);
        const content = {
            id, name: `C-${id}`, pages: {}
        };
        this.save(content);
        return id;
    }

    async LoadContent(content_id: string) {
        let content: IContent;
        if (content_id) {
            content = this.read(content_id);
        }
        if (!content) {
            throw new Error("content not found");
        }
        return content;
    }

    async HandlePageDiff(content_id: string, diff: IPageDiff) {
        const content = this.read(content_id);
        const { pages } = content;
        if (diff.added) {
            diff.added.nodes = {};
            pages[diff.added.id] = diff.added;
        }
        if (diff.removed) {
            delete pages[diff.removed.id];
        }
        if (diff.updated) {
            const page = pages[diff.updated.id];
            if (page) {
                Object.assign(page, diff.updated);
            }
        }
        this.save(content);
        return 1;
    }

    async HandleNodeDiff(content_id: string, page_id: string, diff: INodeDiff) {
        const content = this.read(content_id);
        const { nodes } = content.pages[page_id];
        if (diff.added) {
            nodes[diff.added.id] = diff.added;
        }
        if (diff.removed) {
            delete nodes[diff.removed.id];
        }
        if (diff.updated) {
            const { id, next } = diff.updated;
            Object.assign(nodes[id], next);
        }
        this.save(content);
        return 1;
    }
}
