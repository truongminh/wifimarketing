import { GetConfig } from '@common/server';
import { IFileEntry } from '@service/files';
import { IFileEntryCreate } from '@src/service/files/file_model';
import * as Boom from 'boom';
import { Server } from 'hapi';
import * as Joi from 'joi';
import { GetFileRepo, GetFileStorage } from './file_context';

export async function SetFilesApiRoutes(server: Server) {
    const repo = await GetFileRepo(server);
    const storage = await GetFileStorage(server);
    const config = await GetConfig(server);

    const { UploadTimeout, UploadMaxBytes } = config.storage;

    server.route({
        path: '/api/files',
        method: 'POST',
        options: {
            timeout: {
                socket: UploadTimeout + 1000,
            },
            payload: {
                output: 'file',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: UploadMaxBytes,
                timeout: UploadTimeout,
            },
        },
        handler: async (request, h) => {
            interface IPayload {
                file: {
                    filename: string,
                    path: string,
                    bytes: number,
                    headers: {
                        'Content-Type': string,
                    },
                };
            }
            const { file } = request.payload as IPayload;
            if (!file) {
                throw Boom.badRequest('missing file field');
            }
            const { filename: title, path: dir, bytes, headers } = file;
            const { name, path } = await storage.Import(dir, title);
            const mime = headers['content-type'];
            const entry: IFileEntryCreate = {
                name, mime, path, bytes,
            };
            const id = await repo.Create(entry);
            return { id, ...entry };
        },
    });

    server.route({
        path: '/api/files',
        method: 'GET',
        options: {
            validate: {
                query: {
                    q: Joi.string().optional().allow(''),
                },
            },
        },
        handler(request, h) {
            const { q } = request.query as { q: string };
            return repo.Search(q);
        },
    });

    server.route({
        path: '/api/files/{id}',
        method: 'DELETE',
        options: {
            validate: {
                params: {
                    id: Joi.string().required(),
                },
            },
        },
        handler: async (request, h) => {
            const { id } = request.params;
            const file = await repo.Read(id);
            if (!file) {
                throw Boom.badRequest(`file ${id} not exist`);
            }
            const done = await repo.Delete(id);
            if (done < 1) {
                return 0;
            }
            return storage.Delete(file.path);
        },
    });
}
