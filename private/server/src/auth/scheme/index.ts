import { GetConfig } from '@common/server';
import { Server } from 'hapi';
import * as Basic from './basic';
import * as Bearer from './bearer';

export async function AddAuthScheme(server: Server) {
    const config = await GetConfig(server);
    const strategy = {
        basic: 'basic',
        bearer: 'bearer',
        web: 'web',
    };
    await Basic.AddBasicStrategy(server, strategy.basic);
    await Bearer.AddBearerStrategy(
        server, config.auth.token_name,
        strategy.bearer, strategy.web,
    );
    if (config.auth.default_strategy === 'none') {
        return;
    } else {
        server.auth.default(strategy.bearer);
    }
}
