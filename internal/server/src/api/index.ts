import { Server } from 'hapi';
import { SetOrgsApiRoutes, SetUsersApiRoutes } from './orgs';

export async function SetAPIRoutes(server: Server) {
    // Org
    await SetOrgsApiRoutes(server);
    await SetUsersApiRoutes(server);
}
