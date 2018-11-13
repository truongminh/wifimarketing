import { GetOrgRepo, GetUserRepo } from '@api/orgs';
import { GetSessionUser } from '@auth/service';
import { Server } from 'hapi';

export async function SetAuthApiRoutes(server: Server) {
    const userRepo = await GetUserRepo(server);
    const orgRepo = await GetOrgRepo(server);
    server.route({
        path: '/api/auth/me',
        method: 'GET',
        handler: async (req, h) => {
            const { id, org_id } = GetSessionUser(req);
            const user = await userRepo.Read(id);
            const org = await orgRepo.Read(org_id);
            return { user, org };
        },
    });
}
