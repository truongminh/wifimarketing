import { IFileRepo, IFileStorage } from '@service/files';
import { Server } from 'hapi';

const fileRepoSymbol = Symbol(`file_repo`);

export async function SetFileRepo(server: Server, repo: IFileRepo) {
    Object.defineProperty(server.app, fileRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetFileRepo(server: Server) {
    return server.app[fileRepoSymbol] as IFileRepo;
}

const fileStorageSymbol = Symbol(`file_storage`);

export async function SetFileStorage(server: Server, storage: IFileStorage) {
    Object.defineProperty(server.app, fileStorageSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: storage,
    });
}

export async function GetFileStorage(server: Server) {
    return server.app[fileStorageSymbol] as IFileStorage;
}
