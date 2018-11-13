import * as Assert from 'assert';
import * as Boom from 'boom';
import { Plugin, Request, ResponseToolkit, Server } from 'hapi';

interface IAuthBasicOption {
    unauthorizedAttributes: any;
    allowEmptyUsername: boolean;
    validate(request: Request, username: string, password: string, h: ResponseToolkit)
        : { isValid: boolean, credentials: any, response?: Response };
}

function registerBasicScheme(server: Server, options: IAuthBasicOption) {
    Assert(options, 'Missing basic auth strategy options');
    Assert(typeof options.validate === 'function', 'options.validate must be a valid function in basic scheme');

    const settings = { ...options };

    async function authenticate(request: Request, h: ResponseToolkit) {
        const authorization = request.headers.authorization;
        if (!authorization) {
            throw Boom.unauthorized(null, 'Basic', settings.unauthorizedAttributes);
        }

        const parts = authorization.split(/\s+/);
        if (parts[0].toLowerCase() !== 'basic') {
            throw Boom.unauthorized(null, 'Basic', settings.unauthorizedAttributes);
        }

        if (parts.length !== 2) {
            throw Boom.badRequest('Bad HTTP authentication header format', 'Basic');
        }

        const credentialsPart = Buffer.from(parts[1], 'base64').toString();
        const sep = credentialsPart.indexOf(':');
        if (sep === -1) {
            throw Boom.badRequest('Bad header internal syntax', 'Basic');
        }

        const username = credentialsPart.slice(0, sep);
        const password = credentialsPart.slice(sep + 1);

        if (!username && !settings.allowEmptyUsername) {
            throw Boom.unauthorized(
                'HTTP authentication header missing username',
                'Basic',
                settings.unauthorizedAttributes,
            );
        }

        const { isValid, credentials, response } = await settings.validate(request, username, password, h);

        if (response !== undefined) {
            return h.response(response).takeover();
        }

        if (!isValid) {
            const err = Boom.unauthorized(
                'Bad username or password',
                'Basic',
                settings.unauthorizedAttributes,
            );
            return h.unauthenticated(err, credentials ? { credentials } : null);
        }

        if (!credentials || typeof credentials !== 'object') {
            throw Boom.badImplementation('Bad credentials object received for Basic auth validation');
        }
        return h.authenticated({ credentials });
    }

    const scheme = {
        authenticate,
    };

    return scheme;
}

export const SchemeName = 'basic';

export const plugin: Plugin<any> = {
    name: 'hapi-auth-basic',
    register(server: Server) {
        server.auth.scheme(SchemeName, registerBasicScheme);
    },
};
