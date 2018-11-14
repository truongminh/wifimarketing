import { GetConfig } from '@common/server';
import { Server } from 'hapi';
import { SetRender } from './render';

export async function SetWebRoutes(server: Server) {
    await SetRender(server);
    const config = await GetConfig(server);
    const mainUrl = `${config.server.base_url}support/`;
    // main route
    server.route({
        method: 'GET',
        path: '/',
        options: {
            auth: false,
        },
        handler(req, h) {
            return h.redirect(mainUrl);
        },
    });
}
