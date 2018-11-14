import * as Good from 'good';
import { Server, ServerOptions } from 'hapi';

async function setLogPlugins(server: Server) {
    const options = {
        ops: {
            interval: 60 * 1000,
        },
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }],
            }, {
                module: 'good-console',
            }, 'stdout'],
        },
    };
    await server.register({
        plugin: Good,
        options,
    });
}

const defaultOptions: ServerOptions = {
    routes: {
        validate: {
            failAction(request, h, errors) {
                /* eslint-disable no-param-reassign */
                return errors;
            },
            options: {
                stripUnknown: true,
                allowUnknown: true,
            },
        },
        cors: {
            origin: ['*'],
            credentials: true,
        },
    },
    debug: { request: ['error'] },
};

export async function createServer(port: number) {
    const serverOptions = { ...defaultOptions, port };
    const server = new Server(serverOptions);
    await setLogPlugins(server);
    return server;
}
