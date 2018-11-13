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
import { IDBConfig } from '@lib/db';

interface IServer {
    port: number;
    base_url: string;
    app_dir: string;
}

interface IStorage {
    dir: string;
    UploadTimeout: number;
    UploadMaxBytes: number;
}

interface IAuth {
    default_strategy: string;
    token_name: string;
}

interface IEnv {

}

export interface IConfig {
    server: IServer;
    storage: IStorage;
    db: IDBConfig;
    env: IEnv;
    auth: IAuth;
}

function storageConfig(): IStorage {
    let dir = process.env.DATA_DIR;
    if (!dir) {
        dir = Path.resolve(process.cwd(), 'tmp');
        if (!Fs.existsSync(dir)) {
            Fs.mkdirSync(dir);
        }
    } else {
        dir = Path.resolve(process.cwd(), dir);
        Mkdirp.sync(dir);
        if (!Fs.existsSync(dir)) {
            console.log(`the file dir ${dir} does not exist`);
            process.exit(1);
        }
    }
    const UploadTimeout = 30 * 60 * 1000; // 30 minutes
    const UploadMaxBytes = 64 * Math.pow(2, 20); // 64 MB
    return { dir, UploadMaxBytes, UploadTimeout };
}

function dbConfig(): IDBConfig {
    const url = process.env.DB_URL || 'mongodb://localhost:27017';
    const name = process.env.DB_NAME || 'blog';
    return { url, name };
}

function serverConfig(): IServer {
    const port = +process.env.HTTP_PORT || 3000;
    const baseUrl = process.env.BASE_URL || '/';
    const appDir = Path.join(process.cwd(), process.env.APP_DIR || 'app');
    return { port, base_url: baseUrl, app_dir: appDir };
}

function envConfig(): IEnv {
    return {};
}

function authConfig(): IAuth {
    const default_strategy = process.env.AUTH_DEFAULT_STRATEGY;
    const token_name = process.env.AUTH_TOKEN_NAME;
    if (!token_name) {
        console.log(`AUTH_TOKEN_NAME is not set`);
        process.exit(1);
    }
    return {
        default_strategy, token_name,
    };
}

export const config: Readonly<IConfig> = Object.freeze({
    server: serverConfig(),
    storage: storageConfig(),
    db: dbConfig(),
    env: envConfig(),
    auth: authConfig(),
});

console.log('[configuration]', config);
