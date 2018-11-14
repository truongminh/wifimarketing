import { GetConfig } from '@common/server';
import { Server } from 'hapi';
import * as Inert from 'inert';
import * as Joi from 'joi';
import * as Path from 'path';

async function SetAssetHandle(server: Server) {
    const assetFolder = Path.join(__dirname, 'assets');
    server.route({
        method: 'GET',
        path: '/assets/{path*}',
        options: {
            auth: false,
        },
        handler: {
            directory: {
                path: assetFolder,
                listing: true,
                redirectToSlash: true,
                index: true,
            },
        },
    });

    server.route({
        method: 'GET',
        path: '/favicon.ico',
        options: {
            auth: false,
        },
        handler(req, h) {
            return '';
        },
    });

    const config = await GetConfig(server);
    const appFolder = config.server.app_dir;
    const supportFolder = Path.join(appFolder, 'support');

    server.route({
        method: 'GET',
        path: '/support/{file*}',
        options: {
            auth: 'web',
            validate: {
                params: {
                    file: Joi.string().allow('').optional(),
                },
            },
        },
        handler: (req, h) => {
            const { file } = req.params;
            let fullname = '';
            if (file && file.indexOf('.') !== -1) {
                fullname = Path.join(supportFolder, file);
            } else {
                fullname = Path.join(supportFolder, 'index.html');
            }
            return h.file(fullname, {
                confine: supportFolder,
            });
        },
    });

}

export async function SetRender(server: Server) {
    await server.register(Inert);
    await SetAssetHandle(server);
}
