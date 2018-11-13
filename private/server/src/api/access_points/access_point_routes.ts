import { GetSessionUser } from '@auth/service';
import { IAccessPointCreate, IAccessPointUpdate } from '@service/access_points';
import { Server } from 'hapi';
import * as Joi from 'joi';
import { GetAccessPointRepo } from './access_point_context';

export async function SetAccessPointsApiRoutes(server: Server) {
    const repo = await GetAccessPointRepo(server);
    server.route({
        path: '/api/access_points',
        method: 'POST',
        options: {
            validate: {
                payload: {
                    site_id: Joi.string().min(6).required()
                        .error((e) => 'Site id is required'),
                    mac: Joi.string().required()
                        .error((e) => 'AccessPoint mac must be at least 2 characters'),
                },
            },
        },
        handler(request, h) {
            const { org_id } = GetSessionUser(request);
            const payload = request.payload as IAccessPointCreate;
            payload.org_id = org_id;
            return repo.Create(payload);
        },
    });

    server.route({
        path: '/api/access_points/{id}',
        method: 'PATCH',
        options: {
            validate: {
                params: {
                    id: Joi.string().required().error((e) => 'id is required'),
                },
                payload: {
                    site_id: Joi.string().min(6).required()
                        .error((e) => 'Site id is required'),
                    mac: Joi.string().required()
                        .error((e) => 'AccessPoint mac must be at least 2 characters'),
                },
            },
        },
        handler(request, h) {
            const { id } = request.params;
            const payload = request.payload as IAccessPointUpdate;
            return repo.Update(id, payload);
        },
    });

    server.route({
        path: '/api/access_points',
        method: 'GET',
        options: {
            validate: {
                query: {
                    sites: Joi.string().allow('').default(''),
                },
            },
        },
        handler(request, h) {
            const { org_id } = GetSessionUser(request);
            const { sites } = request.query as { sites: string };
            const siteArr = sites.split(',');
            return repo.ByOrgAndSites(org_id, siteArr);
        },
    });
}
