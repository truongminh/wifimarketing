import { IAccessPointRepo } from '@service/access_points';
import { Server } from 'hapi';

const AccessPointRepoSymbol = Symbol(`access_point_repo`);

export async function SetAccessPointRepo(server: Server, repo: IAccessPointRepo) {
    Object.defineProperty(server.app, AccessPointRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetAccessPointRepo(server: Server) {
    return server.app[AccessPointRepoSymbol] as IAccessPointRepo;
}
