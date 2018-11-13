/************************************************* */
// Loading env file
// DO NOT EDIT
import DotEnv = require('dotenv');
import * as Fs from 'fs';
import Mkdirp = require('mkdirp');
import * as Path from 'path';
const envFile = process.env.ENV_FILE;

if (envFile) {
    const path = Path.join(process.cwd(), envFile);
    if (!Fs.existsSync(path)) {
        console.log(`env file ${path} does not exist`);
        process.exit(1);
    }
    DotEnv.load({ path });
} else {
    DotEnv.load();
}

/************************************************* */
interface IServer {
    port: number;
    base_url: string;
}

interface IEnv {

}

export interface IConfig {
    server: IServer;
    env: IEnv;
}

function serverConfig(): IServer {
    const port = +process.env.HTTP_PORT || 3000;
    const base_url = process.env.BASE_URL || '/';
    return { port, base_url };
}

function envConfig(): IEnv {
    return {};
}

export const config: Readonly<IConfig> = Object.freeze({
    server: serverConfig(),
    env: envConfig(),
});

console.log('[configuration]', config);
