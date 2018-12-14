
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import * as Boom from 'boom';
import { Db } from 'mongodb';
import { NSContent } from './content_model';

export class ContentRepoMongo extends RepoMongo<NSContent.IContent> implements NSContent.IRepo {
    protected get projection(): ProjectionMongo<NSContent.IContent> {
        return {
            _id: 1, org_id: 1, name: 1, viewport: 1,
        };
    }

    constructor(db: Db) {
        super(db, 'contents');
    }

    public async Create({ org_id, name }: NSContent.ICreate): Promise<string> {
        return this.__createOne({ org_id, name, pages: {} });
    }

    public async Read(id: string) {
        const projection = this.projection;
        projection.pages = 1;
        return super.Read(id, projection);
    }

    public async Update(id: string, { name, viewport }: NSContent.IUpdate) {
        return this.__updateByID(id, { name, viewport });
    }

    public async ByOrg(org_id: string): Promise<NSContent.IContent[]> {
        return this.__find({ org_id });
    }

    async UpdatePages(id: string, diff: NSContent.IPageDiff) {
        let { pages } = await this.Read(id);
        pages = pages || {};
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
        return this.__updateByID(id, { pages });
    }

    async UpdateNodes(id: string, page_id: string, diff: NSContent.INodeDiff) {
        const { pages } = await this.Read(id);
        let { nodes } = pages[page_id];
        nodes = nodes || {};
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
        return this.__updateByID(id, { pages });
    }
}
