import { Server } from 'hapi';
import { SetRender } from './render';

export async function SetWebRoutes(server: Server) {
    await SetRender(server);
    server.route({
        path: '/',
        method: 'GET',
        handler(request, h) {
            return h.view('index');
        },
    });
}
