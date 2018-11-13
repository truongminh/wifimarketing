import { IOrgRepo } from '@service/orgs';
import { Server } from 'hapi';

const OrgRepoSymbol = Symbol(`org_repo`);

export async function SetOrgRepo(server: Server, repo: IOrgRepo) {
    Object.defineProperty(server.app, OrgRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetOrgRepo(server: Server) {
    return server.app[OrgRepoSymbol] as IOrgRepo;
}
