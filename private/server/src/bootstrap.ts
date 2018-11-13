import * as MongoDB from '@lib/db/mongo';
import { Server } from 'hapi';
import { IConfig } from './config';

import { SetAccessPointRepo } from '@api/access_points';
import { SetCampaignRepo } from '@api/campaigns';
import { SetContentRepo } from '@api/contents';
import { SetFileRepo, SetFileStorage } from '@api/files';
import { SetOrgRepo, SetUserRepo } from '@api/orgs';
import { SetPlaceRepo } from '@api/places';
import { SetReportRepo } from '@api/report';
import { SessionRepoMongo, SetAuthRepo } from '@auth/service';
import { AuthRepoMongo } from '@auth/service/auth_repo_mongo';
import { GetConfig, NewServer } from '@common/server';
import { AccessPointRepoMongo } from '@service/access_points';
import { CampaignRepoMongo } from '@service/campaigns';
import { ContentRepoMongo } from '@service/contents';
import { FileRepoMongo, FileStorage } from '@service/files';
import { OrgRepoMongo, PasswordRepoBcrypt, UserRepoMongo } from '@service/orgs';
import { PlaceRepoMongo } from '@service/places';
import { ReportRepoMongo } from '@service/report';
import { SetAPIRoutes } from './api';
import { AddAuth } from './auth';
import { SetWebRoutes } from './web';

async function SetAppState(server: Server) {
    const config = await GetConfig(server);
    // Database
    const db = await MongoDB.Connect(config.db);
    const passwordRepo = new PasswordRepoBcrypt();
    // Repos
    await SetFileRepo(server, new FileRepoMongo(db));
    await SetFileStorage(server, new FileStorage(config.storage.dir));

    // Auth
    const orgRepo = new OrgRepoMongo(db);
    const userRepo = new UserRepoMongo(db, passwordRepo);
    await SetOrgRepo(server, orgRepo);
    await SetUserRepo(server, userRepo);
    const sessionRepo = new SessionRepoMongo(db);
    await SetAuthRepo(server, new AuthRepoMongo(
        orgRepo, userRepo, passwordRepo, sessionRepo,
    ));

    // Business
    const placeRepo = new PlaceRepoMongo(db);
    await SetPlaceRepo(server, placeRepo);
    await SetAccessPointRepo(server, new AccessPointRepoMongo(db, placeRepo));
    await SetContentRepo(server, new ContentRepoMongo(db));
    await SetCampaignRepo(server, new CampaignRepoMongo(db));

    // Report
    await SetReportRepo(server, new ReportRepoMongo(db, placeRepo));
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
