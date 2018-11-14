import { IOrgCreate } from '@service/orgs';
import { Server } from 'hapi';
import * as Joi from 'joi';
import { GetOrgRepo } from './org_context';

export async function SetOrgsApiRoutes(server: Server) {
    const repo = await GetOrgRepo(server);
    server.route({
        path: '/api/orgs',
        method: 'POST',
        options: {
            validate: {
                payload: {
                    name: Joi.string().min(3).required()
                        .error((e) => 'Org name must be at least 3 characters'),
                    code: Joi.string().required()
                        .error((e) => 'Org code must be at least 2 characters'),
                    type: Joi.string().allow('', 'basic')
                        .error((e) => 'Org type must be one of [basic]'),
                },
            },
        },
        handler(request, h) {
            const payload = request.payload as IOrgCreate;
            return repo.Create(payload);
        },
    });

    server.route({
        path: '/api/orgs/{id}',
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
        path: '/api/orgs/{id}',
        method: 'PATCH',
        options: {
            validate: {
                params: {
                    id: Joi.string().required().error((e) => 'id is required'),
                },
                payload: {
                    name: Joi.string().min(3).required()
                        .error((e) => 'Org name must be at least 3 characters'),
                    code: Joi.string().required()
                        .error((e) => 'Org code must be at least 2 characters'),
                },
            },
        },
        handler(request, h) {
            const { id } = request.params;
            const payload = request.payload as IOrgCreate;
            return repo.Update(id, payload);
        },
    });

    server.route({
        path: '/api/orgs',
        method: 'GET',
        options: {
            validate: {
                query: {
                    q: Joi.string().optional().allow(''),
                },
            },
        },
        handler(request, h) {
            const { q } = request.query as any;
            return repo.Search(q);
        },
    });
}
