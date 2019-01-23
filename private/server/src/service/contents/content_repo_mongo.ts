
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import { Db } from 'mongodb';
import { ContentNS } from './content_model';

export class ContentRepoMongo extends RepoMongo<ContentNS.Content>
    implements ContentNS.Repo {
    protected get projection(): ProjectionMongo<ContentNS.Content> {
        return {
            _id: 1, org_id: 1, name: 1,
        };
    }

    constructor(db: Db) {
        super(db, 'contents');
    }

    public async Create({ org_id, name }: ContentNS.IContentCreate): Promise<string> {
        return await this.__createOne({ org_id, name });
    }

    public async Read(id: string) {
        const projection = this.projection;
        projection.pages = 1;
        return super.Read(id, projection);
    }

    public async Update(id: string, { name, pages }: ContentNS.IContentUpdate): Promise<number> {
        return this.__updateByID(id, { name, pages });
    }

    public async ByOrg(org_id: string): Promise<ContentNS.Content[]> {
        return this.__find({ org_id });
    }
}
