import { IContentService } from "./content";
import { IContent, IPageDiff } from "@src/state";
import { INodeDiff } from "@src/state";
import { HttpApi } from "@src/core/http";
import { Context } from "@src/core";
import { GetConfiguration } from "./global";

export class ContentServiceBackend implements IContentService {
    private conf = GetConfiguration(this.ctx);
    private api = new HttpApi(`${this.conf.BaseURL}api/contents`);
    constructor(
        private ctx: Context
    ) {}

    async CreateContent(name: string) {
        const id = await this.api.Post<string, Partial<IContent>>(
            '',
            { name }
        );
        return id;
    }

    async LoadContent(content_id: string) {
        let content: IContent;
        if (content_id) {
            content = await this.api.Get<IContent>(`/${content_id}`);
        }
        if (!content) {
            throw new Error("content not found");
        }
        return content;
    }

    async HandlePageDiff(content_id: string, diff: IPageDiff) {
        return this.api.Post<number, IPageDiff>(
            `/${content_id}/pages`,
            diff
        );
    }

    async HandleNodeDiff(content_id: string, page_id: string, diff: INodeDiff) {
        return this.api.Post<number, INodeDiff>(
            `/${content_id}/pages/${page_id}/nodes`,
            diff
        );
    }
}
