
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import { Db, FilterQuery } from 'mongodb';
import {
    ICampaign, ICampaignCreate, ICampaignRepo, ICampaignUpdate,
} from './campaign_model';

export class CampaignRepoMongo extends RepoMongo<ICampaign> implements ICampaignRepo {
    protected get projection(): ProjectionMongo<ICampaign> {
        return {
            _id: 1, org_id: 1, name: 1, sites: 1,
            viewports: 1, schedule: 1, rule: 1,
        };
    }

    constructor(db: Db) {
        super(db, 'campaigns');
    }

    public async Create({ org_id, name }: ICampaignCreate): Promise<string> {
        return await this.__createOne({ org_id, name });
    }

    public async Update(id: string, { name, viewports, rule, schedule, sites }: ICampaignUpdate): Promise<number> {
        return this.__updateByID(id, { name, viewports, rule, schedule, sites });
    }

    public async ByOrg(org_id: string): Promise<ICampaign[]> {
        return this.__find({ org_id });
    }
}
