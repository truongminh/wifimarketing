import { IUserCreate, IUserUpdate } from '@service/orgs';
import { Server } from 'hapi';
import * as Joi from 'joi';
import { GetUserRepo } from './user_context';

export async function SetUsersApiRoutes(server: Server) {
    const repo = await GetUserRepo(server);
    server.route({
        path: '/api/orgs/{org_id}/users',
        method: 'POST',
        options: {
            validate: {
                params: {
                    org_id: Joi.string().required().error((e) => 'Org is required'),
                },
                payload: {
                    username: Joi.string().min(3).required()
                        .error((e) => 'Username must be at least 3 characters'),
                    password: Joi.string().min(6).required()
                        .error((e) => 'Password must be at leat 6 characters'),
                    fullname: Joi.string().min(3).required()
                        .error((e) => 'Name must be at leat 3 characters'),
                },
            },
        },
        handler(request, h) {
            const { org_id } = request.params;
            const { username, password, fullname } = request.payload as IUserCreate;
            return repo.Create({ org_id, username, fullname, password });
        },
    });

    server.route({
        path: '/api/orgs/{org_id}/users/{id}',
        method: 'PATCH',
        options: {
            validate: {
                params: {
                    id: Joi.string().required().error((e) => 'User ID is required'),
                    org_id: Joi.string().required().error((e) => 'Org is required'),
                },
                payload: {
                    username: Joi.string().min(3).optional()
                        .error((e) => 'Username must be at least 3 characters'),
                    fullname: Joi.string().min(3).optional()
                        .error((e) => 'Name must be at leat 6 characters'),
                    password: Joi.string().min(6).optional()
                        .error((e) => 'Password must be at leat 6 characters'),
                },
            },
        },
        handler(request, h) {
            const { id } = request.params;
            const { username, fullname, password } = request.payload as IUserUpdate;
            return repo.Update(id, { fullname, username, password });
        },
    });

    server.route({
        path: '/api/orgs/{org_id}/users',
        method: 'GET',
        options: {
            validate: {
                params: {
                    org_id: Joi.string().required().error((e) => 'Org is required'),
                },
            },
        },
        handler(request, h) {
            const { org_id } = request.params;
            return repo.ByOrg(org_id);
        },
    });
}
