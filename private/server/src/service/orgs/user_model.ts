import { Omit } from '@lib/types';

export interface IUser {
    id: string;
    username: string;
    fullname: string;
    org_id: string;
    password: string;
}

export interface IUserCreate extends Omit<IUser, 'id'> {

}

export interface IUserUpdate extends Omit<IUserCreate, 'org_id'> {
    username: string;
    fullname: string;
    password: string;
}

export interface IUserRead extends Omit<IUser, 'password'> {

}

export interface IUserRepo {
    Create(file: IUserCreate): Promise<string>;
    Read(id: string): Promise<IUserRead | null>;
    Update(id: string, data: Partial<IUserUpdate>): Promise<number>;
    ByOrg(org_id?: string): Promise<IUserRead[]>;
    ReadUserFull(org_id?: string, username?: string): Promise<IUser | null>;
}
