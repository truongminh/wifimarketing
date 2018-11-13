import { IPlaceRepo } from '@service/places';
import { Server } from 'hapi';

const PlaceRepoSymbol = Symbol(`place_repo`);

export async function SetPlaceRepo(server: Server, repo: IPlaceRepo) {
    Object.defineProperty(server.app, PlaceRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetPlaceRepo(server: Server) {
    return server.app[PlaceRepoSymbol] as IPlaceRepo;
}
