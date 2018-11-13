import { IContentRepo } from '@service/contents';
import { Server } from 'hapi';

const ContentRepoSymbol = Symbol(`content_repo`);

export async function SetContentRepo(server: Server, repo: IContentRepo) {
    Object.defineProperty(server.app, ContentRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetContentRepo(server: Server) {
    return server.app[ContentRepoSymbol] as IContentRepo;
}
