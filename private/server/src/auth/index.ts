import { GetConfig } from '@common/server';
import { Server } from 'hapi';
import { SetAuthApiRoutes } from './routes';
import { AddAuthScheme } from './scheme';

export async function AddAuth(server: Server) {
    await AddAuthScheme(server);
    await SetAuthApiRoutes(server);
}
