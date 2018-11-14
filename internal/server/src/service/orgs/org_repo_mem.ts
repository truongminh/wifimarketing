
import { IOrg, IOrgCreate, IOrgRepo } from './org_model';

export class OrgRepoMem implements IOrgRepo {
    private orgs: IOrg[];
    constructor(org_list: string) {
        const orgs = org_list.split(';').map((code) => {
            if (!code) {
                return null;
            }
            const org: IOrg = {
                id: code,
                code,
                name: code
            };
            return org;
        }).filter((org) => org);
        this.orgs = orgs;
    }
    
    public async Read(id: string) {
        return this.orgs.find(org => org.id === id);
    }

    public async Create(data: IOrgCreate): Promise<string> {
        throw new Error("not implemented");
    }

    public async Update(id: string, data: IOrgCreate): Promise<number> {
        throw new Error("not implemented");
    }

    public async Search(q?: string, opt?: string): Promise<IOrg[]> {
        return this.orgs;
    }

    public async ByCode(code: string): Promise<IOrg | null> {
        return this.orgs.find(org => org.code === code);
    }
}
