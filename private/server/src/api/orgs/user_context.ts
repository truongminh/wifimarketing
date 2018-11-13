import { IUserRepo } from '@service/orgs';
import { Server } from 'hapi';

const UserRepoSymbol = Symbol(`user_repo`);

export async function SetUserRepo(server: Server, repo: IUserRepo) {
    Object.defineProperty(server.app, UserRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetUserRepo(server: Server) {
    return server.app[UserRepoSymbol] as IUserRepo;
}
