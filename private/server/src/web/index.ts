import { Server } from 'hapi';
import { SetRender } from './render';
import { SetAuthRoutes } from './routes/auth_routes';
import { SetFilesWebRoutes } from './routes/files_routes';

export async function SetWebRoutes(server: Server) {
    await SetRender(server);
    await SetFilesWebRoutes(server);
    await SetAuthRoutes(server);
    // main route
    server.route({
        method: 'GET',
        path: '/',
        options: {
            auth: false,
        },
        handler(req, h) {
            return h.redirect('./admin/');
        },
    });
}
