
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import * as Boom from 'boom';
import { Db } from 'mongodb';
import {
    IContent, IContentCreate, IContentRepo, IContentUpdate,
} from './content_model';

export class ContentRepoMongo extends RepoMongo<IContent> implements IContentRepo {
    protected get projection(): ProjectionMongo<IContent> {
        return {
            _id: 1, org_id: 1, name: 1, viewport: 1,
        };
    }

    constructor(db: Db) {
        super(db, 'contents');
    }

    public async Create({ org_id, name }: IContentCreate): Promise<string> {
        return await this.__createOne({ org_id, name });
    }

    public async Read(id: string) {
        const projection = this.projection;
        projection.pages = 1;
        return super.Read(id, projection);
    }

    public async Update(id: string, { name, pages, viewport }: IContentUpdate): Promise<number> {
        return this.__updateByID(id, { name, pages, viewport });
    }

    public async ByOrg(org_id: string): Promise<IContent[]> {
        return this.__find({ org_id });
    }
}
