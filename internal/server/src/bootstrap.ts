import * as MongoDB from '@lib/db/mongo';
import { Server } from 'hapi';
import { IConfig } from './config';

import { SetOrgRepo, SetUserRepo } from '@api/orgs';
import { AuthRepo, SessionRepoFile, SetAuthRepo } from '@auth/service';
import { GetConfig, NewServer } from '@common/server';
import { IUser, OrgRepoMongo, PasswordRepoBcrypt, UserRepoMongo, UserRepoMem, OrgRepoMem, PasswordRepoPlain } from '@service/orgs';
import { SetAPIRoutes } from './api';
import { AddAuth } from './auth';
import { SetWebRoutes } from './web';

async function SetAppState(server: Server) {
    const config = await GetConfig(server);
    // Database
    const db = await MongoDB.Connect(config.db);
    const passwordRepo = new PasswordRepoBcrypt();

    // Auth
    const orgRepo = new OrgRepoMongo(db);
    const userRepo = new UserRepoMongo(db, passwordRepo);
    await SetOrgRepo(server, orgRepo);
    await SetUserRepo(server, userRepo);
    
    const sessionRepo = new SessionRepoFile(config.auth.session_file);
    const org_list = config.auth.default_org;
    const user_list = config.auth.default_users;
    const orgRepoMem = new OrgRepoMem(org_list);
    const userRepoMem = new UserRepoMem(user_list, await orgRepoMem.Search());
    await SetAuthRepo(server, new AuthRepo(
        orgRepoMem, userRepoMem, new PasswordRepoPlain(), sessionRepo
    ));

}

export async function StartServer(config: IConfig) {
    const s = await NewServer(config);
    await SetAppState(s);
    await AddAuth(s);
    await SetAPIRoutes(s);
    await SetWebRoutes(s);
    try {
        await s.start();
        console.log(`started server on port ${s.info.port}`);
    } catch (e) {
        console.log(`cannot start server on port ${s.info.port}`);
        throw e;
    }
    return s;
}
