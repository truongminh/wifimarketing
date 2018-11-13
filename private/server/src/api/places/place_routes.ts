import { GetSessionUser } from '@auth/service';
import { IPlaceCreate, IPlaceUpdate } from '@service/places';
import { Server } from 'hapi';
import * as Joi from 'joi';
import { GetPlaceRepo } from './place_context';

export async function SetPlacesApiRoutes(server: Server) {
    const repo = await GetPlaceRepo(server);
    server.route({
        path: '/api/places',
        method: 'POST',
        options: {
            validate: {
                payload: {
                    name: Joi.string().min(6).required()
                        .error((e) => 'Place name must be at least 6 characters'),
                    code: Joi.string().required()
                        .error((e) => 'Place code must be at least 2 characters'),
                    parent: Joi.string().allow('').optional(),
                    type: Joi.string().allow(['site', 'campus', 'city'])
                        .error((e) => 'Place type must be one of [site, campus, city]'),
                },
            },
        },
        handler(request, h) {
            const { org_id } = GetSessionUser(request);
            const payload = request.payload as IPlaceCreate;
            payload.org_id = org_id;
            return repo.Create(payload);
        },
    });

    server.route({
        path: '/api/places/{id}',
        method: 'PATCH',
        options: {
            validate: {
                params: {
                    id: Joi.string().required().error((e) => 'id is required'),
                },
                payload: {
                    name: Joi.string().min(6).required()
                        .error((e) => 'Place name must be at least 6 characters'),
                    code: Joi.string().required()
                        .error((e) => 'Place code must be at least 2 characters'),
                },
            },
        },
        handler(request, h) {
            const { id } = request.params;
            const payload = request.payload as IPlaceUpdate;
            return repo.Update(id, payload);
        },
    });

    server.route({
        path: '/api/places',
        method: 'GET',
        handler(request, h) {
            const { org_id } = GetSessionUser(request);
            return repo.ByOrg(org_id);
        },
    });
}
