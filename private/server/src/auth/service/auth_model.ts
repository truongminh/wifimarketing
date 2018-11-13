import { IOrg, IUser } from '@service/orgs';
import { AuthCredentials } from 'hapi';

export interface ISessionOrg {
    id: string;
    name: string;
    code: string;
}

export interface ISessionUser {
    id: string;
    org_id: string;
    username: string;
    fullname: string;
}

export interface ISession {
    id: string;
    org: ISessionOrg;
    user: ISessionUser;
    valid: boolean;
}

export interface ISessionRepo {
    Create(org: ISessionOrg, user: ISessionUser): Promise<string>;
    Read(id: string): Promise<ISession | null>;
    Invalidate(id: string): Promise<number>;
}

export interface IAuthRepo {
    ReadUser(org_code: string, username: string, password: string)
        : Promise<{ org: IOrg, user: IUser } | null>;
    CreateSession(org: IOrg, user: IUser): Promise<string>;
    ReadSession(id: string): Promise<ISession | null>;
    DestroySession(id: string): Promise<number>;
}

export interface IAuthCredentials extends AuthCredentials {
    user: ISessionUser;
}

export interface IAuthArtifacts {
    session_id: string;
    token: string;
    org: ISessionOrg;
}

export interface IAuthData {
    isValid: boolean;
    credentials?: IAuthCredentials;
    artifacts?: IAuthArtifacts;
}
