import { IPlace, IPlaceRepo } from '@service/places';
import { Db } from 'mongodb';
import { IHistory, IHistoryFilter, IHistoryRepo, IQueryOptions } from './report_model';

function formatDate(d: Date) {
    const dd = d.getDate();
    const mm = d.getMonth() + 1;
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm > 9 ? '' : '0'}${mm}-${dd > 9 ? '' : '0'}${dd}`;
}

function formatHour(d: Date) {
    const hh = d.getHours();
    const mm = d.getMinutes();
    const ss = d.getSeconds();
    return `${hh > 9 ? '' : '0'}${hh}:${mm > 9 ? '' : '0'}${mm}:${ss > 9 ? '' : '0'}${ss}`;
}

export class HistoryRepoMongo implements IHistoryRepo {
    /* tslint:disable-next-line:variable-name */
    private __track_C = this.db.collection('tracks');

    constructor(
        private db: Db,
        private placeRepo: IPlaceRepo,
    ) { }

    public async Read(filter: IHistoryFilter, options: IQueryOptions) {
        const $match = this.getMatch(filter);
        const $project = {
            _id: 1, ctime: 1, wstime: 1, wetime: 1, jtime: 1,
            ap_mac: 1, client_mac: 1, user_agent: 1,
            user_info: 1, site_id: 1, campaign: { name: 1 },
        };
        const sortable_columns = {
            date: 'ctime',
        };
        const { sort_by, sort_dir, page_index, page_size } = options;
        const sort_column = sortable_columns[sort_by || 'ctime'];
        const $sort = { [sort_column]: sort_dir === 'desc' ? -1 : 1 };
        const $skip = page_size * page_index;
        const $limit = page_size > 0 ? page_size : 1;

        const data = await this.__track_C.aggregate([
            { $match }, { $sort }, { $skip }, { $limit },
            {
                $lookup: {
                    from: 'campaigns',
                    localField: 'campaign_id',
                    foreignField: '_id',
                    as: 'campaign',
                },
            },
            { $unwind: '$campaign' },
            { $project },
        ]).toArray();

        const placeMap = await this.getPlaces(filter.org_id);

        const format = (
            {
                _id: id, ap_mac, client_mac, site_id,
                user_agent, user_info, campaign, wstime, wetime, jtime,
            },
        ) => {
            const { os, viewport: view, browser } = user_agent;
            const { name, gender, email } = (user_info || {}) as any;
            const hour = formatHour(wstime);
            const date = formatDate(wstime);
            const watch = (wetime && wstime) ? (wetime.getTime() - wstime.getTime()) / 1000 : 0;
            const joined = jtime ? true : false;
            const row: IHistory = {
                id, ap_mac, client_mac,
                os, view, browser,
                name, gender, email,
                campaign: campaign.name,
                hour, date, watch,
                joined,
            };
            const site = placeMap[site_id];
            if (site) {
                row.site = site.name;
                const campus = placeMap[site.parent];
                if (campus) {
                    row.campus = campus.name;
                    const city = placeMap[campus.parent];
                    if (city) {
                        row.city = city.name;
                    }
                }
            }
            return row;
        };
        return data.map(format);
    }

    public async Aggregate(group_by: 'connections' | 'devices' | 'sites', filter: IHistoryFilter) {
        switch (group_by) {
            case 'connections':
                return this.AggegateByConnection(filter);
            case 'devices':
                return this.AggregateByDevice(filter);
            case 'sites':
                return this.AggregateBySite(filter);
        }
        return [];
    }

    public async AggegateByConnection(filter: IHistoryFilter) {
        const $match = this.getMatch(filter);
        const $project = {
            _id: 0,
            break_point: '$_id',
            connected: 1,
            disconnected: { $subtract: ['$count', '$connected'] },
            time: 1,
            count: 1,
        };
        const $group = {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$ctime' } },
            count: { $sum: 1 },
            connected: { $sum: { $cond: [{ $gt: ['$jtime', '$ctime'] }, 1, 0] } },
            time: {
                $sum: {
                    $cond: [
                        { $gt: ['$wetime', '$wstime'] },
                        { $subtract: ['$wetime', '$wstime'] },
                        0,
                    ],
                },
            },
        };

        const data = await this.aggregate([
            { $match },
            { $group },
            { $project },
        ]).toArray();
        return data;
    }

    public async AggregateByDevice(filter: IHistoryFilter) {
        const $match = this.getMatch(filter);
        const devices = await this.aggregate([
            { $match },
            { $group: { _id: '$client_mac' } },
        ]).toArray();
        const userAgent = await this.aggregate([
            { $match },
            {
                $group: {
                    _id: {
                        os: '$user_agent.os',
                        br: '$user_agent.browser',
                        type: '$user_agent.viewport',
                    },
                    count: { $sum: 1 },
                },
            },
        ]).toArray();

        const totalDevice = devices.length;
        const os = {
            windows: (userAgent).filter((el) => el._id.os === 'windows')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
            ios: (userAgent).filter((el) => el._id.os === 'ios')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
            android: userAgent.filter((el) => el._id.os === 'android')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
            other: userAgent
                .filter(
                    (el) => (el._id.os !== 'windows'
                        && el._id.os !== 'ios'
                        && el._id.os !== 'android'),
                ).map((el) => el.count)
                .reduce((a, b) => a + b, 0),
        };
        const br = {
            firefox: (userAgent).filter((el) => el._id.br === 'firefox')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
            chrome: (userAgent).filter((el) => el._id.br === 'chrome')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
            safari: (userAgent).filter((el) => el._id.br === 'safari')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
            other: userAgent
                .filter((el) =>
                    (el._id.br !== 'firefox'
                        && el._id.br !== 'chrome'
                        && el._id.br !== 'safari'),
                ).map((el) => el.count)
                .reduce((a, b) => a + b, 0),
        };
        const deviceType = {
            pc: (userAgent).filter((el) => el._id.type === 'pc')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
            tablet: (userAgent).filter((el) => el._id.type === 'tablet')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
            mobile: (userAgent).filter((el) => el._id.type === 'mobile')
                .map((el) => el.count).reduce((a, b) => a + b, 0),
        };
        return { totalDevice, os, br, deviceType };
    }

    public async AggregateBySite(filter: IHistoryFilter) {
        const $match = this.getMatch(filter);
        const $group = {
            _id: '$site_id',
            count: { $sum: 1 },
            connected: { $sum: { $cond: [{ $gt: ['$jtime', '$ctime'] }, 1, 0] } },
            avg_time: {
                $avg: {
                    $cond: [
                        { $gt: ['$wetime', '$wstime'] },
                        { $subtract: ['$wetime', '$wstime'] },
                        0,
                    ],
                },
            },
            client_mac: { $addToSet: '$client_mac' },
            email: { $addToSet: '$user_info.email' },
            tel: { $addToSet: '$user_info.tel' },
        };
        const $project = {
            _id: 0,
            site: { $filter: { input: '$places', as: 'place', cond: { $eq: ['$$place.type', 'site'] } } },
            campus: { $filter: { input: '$places', as: 'place', cond: { $eq: ['$$place.type', 'campus'] } } },
            city: { $filter: { input: '$places', as: 'place', cond: { $eq: ['$$place.type', 'city'] } } },
            connected: 1,
            disconnected: { $subtract: ['$count', '$connected'] },
            connected_device: { $size: '$client_mac' },
            avg_time: 1,
        };

        const data = await this.aggregate([
            { $match },
            { $group },
            {
                $graphLookup: {
                    from: 'places',
                    startWith: '$_id',
                    connectFromField: 'parent',
                    connectToField: '_id',
                    as: 'places',
                },
            },
            { $project },
        ]).toArray();
        const format = (d) => {
            d.site = d.site[0].name;
            d.campus = d.campus[0].name;
            d.city = d.city[0].name;
            return d;
        };
        return data.map(format);
    }

    private getMatch({ org_id, ctime, sites }: IHistoryFilter) {
        return {
            org_id,
            ctime: { $gte: ctime.min, $lte: ctime.max },
            site_id: { $in: sites },
            wstime: { $exists: true },
        };
    }

    private aggregate(pipelines: any[]) {
        return this.__track_C.aggregate(pipelines);
    }

    private async getPlaces(org_id: string) {
        const places = await this.placeRepo.ByOrg(org_id);
        const map: { [index: string]: IPlace } = {};
        places.forEach((p) => map[p.id] = p);
        return map;
    }
}
