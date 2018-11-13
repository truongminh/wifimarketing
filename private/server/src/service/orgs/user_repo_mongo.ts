
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import * as Boom from 'boom';
import { Db, FilterQuery } from 'mongodb';
import { IPasswordRepo } from './password';
import { IUser, IUserCreate, IUserRepo, IUserUpdate } from './user_model';

export class UserRepoMongo extends RepoMongo<IUser> implements IUserRepo {
    protected get projection(): ProjectionMongo<IUser> {
        return {
            username: 1, fullname: 1, org_id: 1,
        };
    }

    constructor(db: Db, private passwordRepo: IPasswordRepo) {
        super(db, 'users');
    }

    public async Create({ org_id, username, fullname, password }: IUserCreate): Promise<string> {
        await this.checkUniqueUser(org_id, username);
        if (password) {
            password = await this.passwordRepo.Hash(password);
        }
        return await this.__createOne({ org_id, username, fullname, password });
    }

    public async Update(
        id: string,
        { username, fullname, password }: Partial<IUserUpdate>,
    ): Promise<number> {
        if (username) {
            const current = await this.__readOrThrow(id);
            if (current.username !== username) {
                await this.checkUniqueUser(current.org_id, username);
            }
        }
        if (password) {
            password = await this.passwordRepo.Hash(password);
        }
        return this.__updateByID(id, { username, fullname, password });
    }

    public async ByOrg(org_id: string): Promise<IUser[]> {
        return this.__find({ org_id });
    }

    public async ReadUserFull(org_id: string, username: string) {
        const projection = this.projection;
        projection.password = 1;
        return this.__findOne({ org_id, username }, projection);
    }

    private async checkUniqueUser(org_id: string, username: string) {
        const c = await this.__count({ org_id, username });
        if (c > 0) {
            throw Boom.preconditionFailed(`user ${username} existed in org ${org_id}`);
        }
    }
}
