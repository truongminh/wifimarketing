import { Omit } from '@lib/types';

export type IPlaceType = 'site' | 'campus' | 'city' | 'region';

export interface IPlace {
    id: string;
    org_id: string;
    name: string;
    code: string;
    type: IPlaceType;
    parent: string;
}

export interface IPlaceCreate {
    org_id: string;
    name: string;
    code: string;
    type: IPlaceType;
    parent: string;
}

export interface IPlaceUpdate {
    name: string;
    code: string;
}

export interface IPlaceRepo {
    Create(data: IPlaceCreate): Promise<string>;
    Update(id: string, data: Partial<IPlaceUpdate>): Promise<number>;
    ByOrg(org_id: string): Promise<IPlace[]>;
}
