import { IUser, IUserCreate, IUserRepo } from './user_model';
import { IOrg } from './org_model';

export class UserRepoMem implements IUserRepo {
    private users: IUser[];
    constructor(user_list = '', orgs: IOrg[] = []) {
        const org_id = orgs[0] ? orgs[0].id : 'unknown';
        const users = user_list.split(';').map((s) => {
            const [username, password] = s.trim().split('@');
            if (!username || !password) {
                return null;
            }
            const user: IUser = {
                id: username,
                org_id,
                username,
                password,
                fullname: username,
            };
            return user;
        }).filter((u) => u);
        this.users = users;
    }

    public async Read(id: string) {
        return this.users.find(u => u.id === id);
    }

    public async ReadFull(org_id?: string, username?: string) {
        return this.users.find(u => u.org_id === org_id && u.username === username);
    }

    public async Create(u: IUserCreate): Promise<string> {
        throw new Error("not implemented");
    }

    public async Update(id: string, u: IUserCreate): Promise<number> {
        throw new Error("not implemented");
    }

    public async Search(q?: string, opt?: string): Promise<IUser[]> {
        throw new Error("not implemented");
    }

    public async ByOrg(org_id: string) {
        return this.users.filter(u => u.org_id === org_id);
    }

}
