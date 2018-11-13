
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import { Db, FilterQuery } from 'mongodb';
import { IOrg, IOrgCreate, IOrgRepo } from './org_model';

export class OrgRepoMongo extends RepoMongo<IOrg> implements IOrgRepo {
    protected get projection(): ProjectionMongo<IOrg> {
        return {
            _id: 1, name: 1, code: 1, ctime: 1,
        };
    }

    constructor(db: Db) {
        super(db, 'orgs');
    }

    public async Create({ name, code }: IOrgCreate): Promise<string> {
        return await this.__createOne({ name, code });
    }

    public async Update(id: string, { name, code }: IOrgCreate): Promise<number> {
        return this.__updateByID(id, { name, code });
    }

    public async Search(q?: string, opt?: string): Promise<IOrg[]> {
        const filter: FilterQuery<IOrg> = {};
        if (q) {
            filter.name = {
                $regex: q,
                $options: 'i',
            };
        }
        return this.__find(filter);
    }

    public async ByCode(code: string): Promise<IOrg | null> {
        return this.__findOne({ code });
    }
}
