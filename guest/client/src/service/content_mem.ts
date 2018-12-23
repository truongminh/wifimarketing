import { IContentService } from "./content";
import { IContent } from "@src/state";

import { Context } from "@src/core";

const content: IContent = {
    id: '1',
    name: 'Content',
    pages: {
        'p1': {
            id: 'p1',
            name: 'Page 1',
            nodes: {
                
            }
        }
    }
}

export class ContentServiceMem implements IContentService {
    constructor(
        private ctx: Context
    ) {}

    async LoadContent(content_id: string) {
        return null;
    }

}
