
export interface ICapmaignViewport {
    type: string;
    content_id: string;
}

export interface ICampaignSchedule {
    start: string;
    end: string;
    mode: '24h' | 'custom';
    weekdays: any[];
}

export interface ICampaignRule {
    weight: number;
}

export interface ICampaign {
    id: string;
    org_id: string;
    name: string;
    sites: string[];
    viewports: ICapmaignViewport[];
    schedule: ICampaignSchedule;
    rule: ICampaignRule;
}

export interface ICampaignCreate {
    org_id: string;
    name: string;
}

export interface ICampaignUpdate {
    name: string;
    viewports: ICapmaignViewport[];
    schedule: ICampaignSchedule;
    rule: ICampaignRule;
    sites: string[];
}

export interface ICampaignRepo {
    Create(data: ICampaignCreate): Promise<string>;
    Read(id: string): Promise<ICampaign>;
    Update(id: string, data: Partial<ICampaignUpdate>): Promise<number>;
    ByOrg(org_id: string): Promise<ICampaign[]>;
}
