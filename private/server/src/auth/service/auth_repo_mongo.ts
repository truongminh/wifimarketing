import { IOrg, IOrgRepo, IUser, IUserRepo } from '@service/orgs';
import { IPasswordRepo } from '@service/orgs';
import { Db } from 'mongodb';
import { IAuthRepo, ISession, ISessionOrg, ISessionRepo, ISessionUser } from './auth_model';

export class AuthRepoMongo implements IAuthRepo {
    constructor(
        private orgRepo: IOrgRepo,
        private userRepo: IUserRepo,
        private passwordRepo: IPasswordRepo,
        private sessionRepo: ISessionRepo,
    ) { }

    public async ReadUser(org_code: string, username: string, password: string) {
        const org: IOrg = await this.orgRepo.ByCode(org_code);
        if (!org) {
            return null;
        }
        const user = await this.userRepo.ReadUserFull(org.id, username);
        if (!user) {
            return null;
        }
        const ok = await this.passwordRepo.Compare(password, user.password);
        if (!ok) {
            return null;
        }
        return { user, org };
    }

    public async CreateSession(org: IOrg, user: IUser) {
        const sessionOrg: ISessionOrg = {
            id: org.id,
            code: org.code,
            name: org.name,
        };
        const sessionUser: ISessionUser = {
            id: user.id,
            org_id: user.org_id,
            fullname: user.fullname,
            username: user.username,
        };
        return this.sessionRepo.Create(sessionOrg, sessionUser);
    }

    public async ReadSession(id: string) {
        return this.sessionRepo.Read(id);
    }

    public async DestroySession(id: string) {
        return this.sessionRepo.Invalidate(id);
    }

}
