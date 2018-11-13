export interface IContentPage {}

export interface IContentViewport {
    width: number;
    height: number;
}

export interface IContent {
    id: string;
    org_id: string;
    name: string;
    pages: IContentPage[];
    viewport: IContentViewport;
}

export interface IContentCreate {
    org_id: string;
    name: string;
}

export interface IContentUpdate {
    name: string;
    pages: IContentPage[];
    viewport: IContentViewport;
}

export interface IContentRepo {
    Create(data: IContentCreate): Promise<string>;
    Read(id: string): Promise<IContent>;
    Update(id: string, data: Partial<IContentUpdate>): Promise<number>;
    ByOrg(org_id: string): Promise<IContent[]>;
}
