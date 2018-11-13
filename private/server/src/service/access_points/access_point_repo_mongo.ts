
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import { IPlace, IPlaceRepo } from '@service/places';
import * as Boom from 'boom';
import { Db } from 'mongodb';
import {
    IAccessPoint, IAccessPointCreate, IAccessPointRead, IAccessPointRepo, IAccessPointUpdate,
} from './access_point_model';

export class AccessPointRepoMongo extends RepoMongo<IAccessPoint> implements IAccessPointRepo {
    protected get projection(): ProjectionMongo<IAccessPoint> {
        return {
            _id: 1, org_id: 1, mac: 1, site_id: 1,
        };
    }

    constructor(db: Db, private placeRepo: IPlaceRepo) {
        super(db, 'access_points');
    }

    public async Create({ org_id, mac, site_id }: IAccessPointCreate): Promise<string> {
        await this.checkUniqueMac(org_id, mac);
        return await this.__createOne({ org_id, mac, site_id });
    }

    public async Update(id: string, { mac, site_id }: IAccessPointUpdate): Promise<number> {
        if (mac) {
            const current = await this.__readOrThrow(id);
            if (current.mac !== mac) {
                await this.checkUniqueMac(current.org_id, mac);
            }
        }
        return this.__updateByID(id, { mac, site_id });
    }

    public async Delete(id: string) {
        const existChild = await this.__count({ parent: id });
        if (existChild) {
            throw Boom.badRequest(`Cannot delete place ${id}, which has  ${existChild} children.`);
        }
        return super.Delete(id);
    }

    public async ByOrgAndSites(org_id: string, sites?: string[]) {
        const $match = { org_id } as any;
        if (sites && sites.length > 0) {
            $match.site_id = {
                $in: sites,
            };
        }
        const placeMap = await this.getPlaces(org_id);
        const $project = this.projection;
        const pipeline = [{ $match }, { $project }];
        const data = await this.__C.aggregate(pipeline).toArray();
        const res = data.map((d) => this.MapID(d)) as IAccessPointRead[];
        res.forEach((ap) => {
            ap.site = placeMap[ap.site_id];
            if (ap.site) {
                ap.campus = placeMap[ap.site.parent];
                if (ap.campus) {
                    ap.city = placeMap[ap.campus.parent];
                }
            }
        });
        return res;
    }

    private async checkUniqueMac(org_id: string, mac: string) {
        const c = await this.__count({ org_id, mac });
        if (c > 0) {
            throw Boom.badRequest(`access_point with mac ${mac} existed`);
        }
    }

    private async getPlaces(org_id: string) {
        const places = await this.placeRepo.ByOrg(org_id);
        const map: { [index: string]: IPlace } = {};
        places.forEach((p) => map[p.id] = p);
        return map;
    }
}
