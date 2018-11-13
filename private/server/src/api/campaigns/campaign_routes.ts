import { GetSessionUser } from '@auth/service';
import { ICampaignCreate, ICampaignUpdate } from '@service/campaigns';
import { Server } from 'hapi';
import * as Joi from 'joi';
import { GetCampaignRepo } from './campaign_context';

export async function SetCampaignsApiRoutes(server: Server) {
    const repo = await GetCampaignRepo(server);
    server.route({
        path: '/api/campaigns',
        method: 'POST',
        options: {
            validate: {
                payload: {
                    name: Joi.string().min(3).required()
                        .error((e) => 'Campaign name must be at least 3 characters'),
                },
            },
        },
        handler(request, h) {
            const { org_id } = GetSessionUser(request);
            const payload = request.payload as ICampaignCreate;
            payload.org_id = org_id;
            return repo.Create(payload);
        },
    });

    server.route({
        path: '/api/campaigns/{id}',
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
        path: '/api/campaigns/{id}',
        method: 'PATCH',
        options: {
            validate: {
                params: {
                    id: Joi.string().required().error((e) => 'id is required'),
                },
                payload: {
                    name: Joi.string().min(3).optional()
                        .error((e) => 'Campaign name must be at least 3 characters'),
                    schedule: Joi.object({
                        start: Joi.string().required(),
                        end: Joi.string().required(),
                        mode: Joi.string().allow('24h', 'custom').default('24h'),
                        weekdays: Joi.array().allow(null).optional(),
                    }).optional(),
                    viewports: Joi.array().items(
                        Joi.object({
                            type: Joi.string().allow('pc', 'tablet', 'mobile').required(),
                            content_id: Joi.string().allow(''),
                        }),
                    ).optional(),
                    sites: Joi.array().items(Joi.string()).optional(),
                    rule: Joi.object({
                        weight: Joi.number().default(1),
                    }).optional(),
                },
            },
        },
        handler(request, h) {
            const { id } = request.params;
            const payload = request.payload as ICampaignUpdate;
            return repo.Update(id, payload);
        },
    });

    server.route({
        path: '/api/campaigns',
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
