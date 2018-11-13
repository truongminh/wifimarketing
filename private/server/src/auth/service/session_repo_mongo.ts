
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import { Db } from 'mongodb';
import { ISession, ISessionOrg, ISessionRepo, ISessionUser } from './auth_model';

export class SessionRepoMongo extends RepoMongo<ISession> implements ISessionRepo {
    protected get projection(): ProjectionMongo<ISession> {
        return {
            _id: 1, org: 1, user: 1, valid: 1,
        };
    }

    constructor(db: Db) {
        super(db, 'sessions');
    }

    public async Create(org: ISessionOrg, user: ISessionUser): Promise<string> {
        const valid = true;
        return await this.__createOne({ org, user, valid });
    }

    public async Invalidate(id: string) {
        const valid = false;
        return this.__updateByID(id, { valid });
    }
}
