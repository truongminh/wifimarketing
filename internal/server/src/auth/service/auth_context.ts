import { Request, Server } from 'hapi';
import { IAuthRepo, ISessionUser } from './auth_model';

const AuthRepoSymbol = Symbol(`auth_repo`);

export async function SetAuthRepo(server: Server, repo: IAuthRepo) {
    Object.defineProperty(server.app, AuthRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetAuthRepo(server: Server) {
    return server.app[AuthRepoSymbol] as IAuthRepo;
}

export function GetSessionUser(request: Request) {
    return request.auth.credentials.user as ISessionUser;
}
