import { GetSessionUser } from '@auth/service';
import { IContentCreate, IContentUpdate } from '@service/contents';
import { Server } from 'hapi';
import * as Joi from 'joi';
import { GetContentRepo } from './content_context';

export async function SetContentsApiRoutes(server: Server) {
    const repo = await GetContentRepo(server);
    server.route({
        path: '/api/contents',
        method: 'POST',
        options: {
            validate: {
                payload: {
                    name: Joi.string().min(3).required()
                        .error((e) => 'Content name must be at least 3 characters'),
                },
            },
        },
        handler(request, h) {
            const { org_id } = GetSessionUser(request);
            const payload = request.payload as IContentCreate;
            payload.org_id = org_id;
            return repo.Create(payload);
        },
    });

    server.route({
        path: '/api/contents/{id}',
        method: 'GET',
        options: {
            validate: {
                params: {
                    id: Joi.string().required().error((e) => 'id is required'),
                },
            },
        },
        handler(request, h) {
            const { id } = request.params;
            return repo.Read(id);
        },
    });

    server.route({
        path: '/api/contents/{id}',
        method: 'PATCH',
        options: {
            validate: {
                params: {
                    id: Joi.string().required().error((e) => 'id is required'),
                },
                payload: {
                    name: Joi.string().min(3).optional()
                        .error((e) => 'Content name must be at least 3 characters'),
                    pages: Joi.array().items({
                        elements: Joi.array().optional(),
                    }),
                    viewport: Joi.object({
                        width: Joi.number().required(),
                        height: Joi.number().required(),
                    }).optional(),
                },
            },
        },
        handler(request, h) {
            const { id } = request.params;
            const payload = request.payload as IContentUpdate;
            return repo.Update(id, payload);
        },
    });

    server.route({
        path: '/api/contents',
        method: 'GET',
        options: {
            validate: {
                query: {
                    q: Joi.string().optional().allow(''),
                },
            },
        },
        handler(request, h) {
            const { org_id } = GetSessionUser(request);
            return repo.ByOrg(org_id);
        },
    });
}
