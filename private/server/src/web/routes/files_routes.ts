import { GetFileRepo, GetFileStorage } from '@api/files';
import * as Boom from 'boom';
import { Server } from 'hapi';
import * as Joi from 'joi';

export async function SetFilesWebRoutes(server: Server) {
    const repo = await GetFileRepo(server);
    const storage = await GetFileStorage(server);
    server.route({
        path: '/files/{id}',
        method: 'GET',
        options: {
            auth: false,
            validate: {
                params: {
                    id: Joi.string().required().error((e) => 'id is required'),
                },
            },
        },
        handler: async (request, h) => {
            const { id } = request.params;
            const entry = await repo.Read(id);
            if (!entry) {
                throw Boom.badRequest(`file id ${id} not exist`);
            }
            const { path } = entry;
            return h.file(path, {
                confine: storage.BaseDir(),
            });
        },
    });
    server.route({
        path: '/files/{path*}',
        method: 'GET',
        options: {
            auth: false,
        },
        handler: (request, h) => {
            const { path } = request.params;
            return h.file(path, {
                confine: storage.BaseDir(),
            });
        },
    });
}
