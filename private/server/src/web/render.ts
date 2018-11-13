import { GetConfig } from '@common/server';
import { Server } from 'hapi';
import * as Inert from 'inert';
import * as Joi from 'joi';
import * as Path from 'path';
import * as Vision from 'vision';

async function SetViewRender(server: Server) {
    const config = await GetConfig(server);
    const base_url = config.server.base_url;
    const context = {
        base_url,
    };
    const isCached = false;
    server.views({
        engines: {
            html: require('handlebars'),
        },
        relativeTo: __dirname,
        path: 'templates',
        layoutPath: 'templates/layout',
        layout: 'layout',
        helpersPath: 'templates/helpers',
        partialsPath: 'templates/partials',
        context, isCached,
    });
}

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
    const imageFolder = Path.join(assetFolder, 'img');
    server.route({
        method: 'GET',
        path: '/favicon.ico',
        options: {
            auth: false,
        },
        handler(req, h) {
            return h.file('favicon.ico', {
                confine: imageFolder,
            });
        },
    });

    const config = await GetConfig(server);
    const appFolder = config.server.app_dir;
    const adminFolder = Path.join(appFolder, 'admin');

    server.route({
        method: 'GET',
        path: '/admin/{file*}',
        options: {
            auth: {
                strategy: 'web',
            },
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
                fullname = Path.join(adminFolder, file);
            } else {
                fullname = Path.join(adminFolder, 'index.html');
            }
            return h.file(fullname, {
                confine: adminFolder,
            });
        },
    });

}

export async function SetRender(server: Server) {
    await server.register(Vision);
    await server.register(Inert);
    await SetAssetHandle(server);
    await SetViewRender(server);
}
