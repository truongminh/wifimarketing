// The server keeps a single view of its state
// Read for more: https://gist.github.com/hueniverse/f01faf422eb038d87d57

import { IConfig } from '@src/config';
import { SetConfig } from './config';
import { createServer } from './server';

export async function NewServer(config: IConfig) {
    const server = await createServer(config.server.port);
    await SetConfig(server, config);
    return server;
}

export { GetConfig } from './config';
