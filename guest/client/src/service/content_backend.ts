import { IContentService } from "./content";
import { IContent } from "@src/state";
import { HttpApi } from "@src/core/http";
import { Context } from "@src/core";
import { GetConfiguration } from "./global";

export class ContentServiceBackend implements IContentService {
    private conf = GetConfiguration(this.ctx);
    private api = new HttpApi(`${this.conf.BaseURL}api/contents`);
    constructor(
        private ctx: Context
    ) {}

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
}
