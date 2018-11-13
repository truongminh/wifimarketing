
export interface IHistory {
    id: string;
    city?: string;
    campus?: string;
    site?: string;
    ap_mac: string;
    client_mac: string;
    view: 'pc' | 'mobile';
    os: string;
    browser: string;
    name: string;
    gender: string;
    email: string;
    campaign: string;
    date: string;
    hour: string;
    watch: number;
    joined: boolean;
}

export interface IQueryOptions {
    sort_by: string;
    sort_dir: '' | 'asc' | 'desc';
    page_index: number;
    page_size: number;
}

export interface IHistoryFilter {
    org_id: string;
    ctime: { min: Date, max: Date };
    sites: string[];
}

export interface IHistoryRepo {
    Read(filter: IHistoryFilter, options: IQueryOptions): Promise<IHistory[]>;
    Aggregate(
        group_by: 'connections' | 'devices' | 'sites', filter: IHistoryFilter,
    ): Promise<any>;
}

export interface IReportRepo {
    History: IHistoryRepo;
}
