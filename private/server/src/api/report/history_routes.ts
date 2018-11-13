import { GetSessionUser } from '@auth/service';
import { IHistory, IHistoryFilter, IHistoryRepo, IQueryOptions, IReportRepo } from '@service/report';
import * as DayJS from 'dayjs';
import { Request, Server } from 'hapi';
import * as Joi from 'joi';
import { GetReportRepo } from './report_context';

export async function SetReportHistoryRoutes(server: Server, repo: IReportRepo) {
    const getFilter = (request: Request) => {
        interface IRawQuery {
            from: Date;
            to: Date;
            sites: string;
        }
        const { org_id } = GetSessionUser(request);
        const q: IRawQuery = request.query as any;
        const ctime = {
            min: DayJS(q.from).toDate(),
            max: DayJS(q.to).add(1, 'day').subtract(1, 'second').toDate(),
        };
        const sites = q.sites.split(',');
        const filter: IHistoryFilter = {
            org_id, sites, ctime,
        };
        return filter;
    };

    const filterValidator = {
        from: Joi.string().required()
            .error((e) => 'Start time is missing'),
        to: Joi.string().required()
            .error((e) => 'End time is missing'),
        sites: Joi.string().required()
            .error((e) => 'Location is missing'),
    };

    const optionsValidator = {
        page_index: Joi.number().default(0),
        page_size: Joi.number().default(10),
        sort_by: Joi.string().allow('').optional(),
        sort_dir: Joi.string().allow('', 'asc', 'desc').default(''),
    };

    server.route({
        path: '/api/report/history',
        method: 'GET',
        options: {
            validate: {
                query: {
                    ...filterValidator,
                    ...optionsValidator,
                },
            },
        },
        handler(request, h) {
            const q: IQueryOptions = request.query as any;
            const filter = getFilter(request);
            if (filter.sites.length < 1) {
                return [];
            }
            return repo.History.Read(filter, q);
        },
    });

    server.route({
        path: '/api/report/dashboard/{group_by}',
        method: 'GET',
        options: {
            validate: {
                params: {
                    group_by: Joi.string().required(),
                },
                query: filterValidator,
            },
        },
        handler(request, h) {
            const { group_by } = request.params as any;
            const filter = getFilter(request);
            return repo.History.Aggregate(group_by, filter);
        },
    });
}
