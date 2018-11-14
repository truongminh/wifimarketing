import { Server } from 'hapi';
import { SetAuthWebRoutes } from './auth_routes';
import { GetSessionUser, GetAuthRepo } from '@auth/service';

export async function SetAuthRoutes(server: Server) {
    const authRepo = await GetAuthRepo(server);
    await SetAuthWebRoutes(server);
    
    server.route({
        path: '/api/auth/me',
        method: 'GET',
        handler: async (req, h) => {
            const { id, org_id } = GetSessionUser(req);
            const { user, org } = await authRepo.ReadUser(org_id, id);
            return { user, org };
        },
    });
}
