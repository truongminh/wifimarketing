import { Server } from 'hapi';
import { IConfig } from './config';

import { GetConfig, NewServer } from '@common/server';
import { SetWebRoutes } from './web';

async function SetAppState(server: Server) {
    const config = await GetConfig(server);
}

export async function StartServer(config: IConfig) {
    const s = await NewServer(config);
    await SetAppState(s);
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
