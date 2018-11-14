import { Server } from 'hapi';
import { SetAuthRoutes } from './routes';
import { AddAuthScheme } from './scheme';

export async function AddAuth(server: Server) {
    await AddAuthScheme(server);
    await SetAuthRoutes(server);
}
