import { IConfig } from '@src/config';
import { Server } from 'hapi';

const configSymbol = Symbol(`config`);

export async function SetConfig(server: Server, config: IConfig) {
    const c = Object.freeze({ ...config });
    Object.defineProperty(server.app, configSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: c,
    });
}

export async function GetConfig(server: Server) {
    return server.app[configSymbol] as Readonly<IConfig>;
}
