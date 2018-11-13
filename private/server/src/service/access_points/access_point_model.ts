import { IPlace } from '@service/places';

export interface IAccessPoint {
    id: string;
    org_id: string;
    mac: string;
    site_id: string;
}

export interface IAccessPointCreate {
    org_id: string;
    mac: string;
    site_id: string;
}

export interface IAccessPointUpdate {
    mac: string;
    site_id: string;
}

export interface IAccessPointRead extends IAccessPoint {
    site?: IPlace;
    campus?: IPlace;
    city?: IPlace;
}

export interface IAccessPointRepo {
    Create(data: IAccessPointCreate): Promise<string>;
    Update(id: string, data: Partial<IAccessPointUpdate>): Promise<number>;
    ByOrgAndSites(org_id: string, sites?: string[]): Promise<IAccessPointRead[]>;
}
