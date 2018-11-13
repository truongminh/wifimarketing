'use strict';

import { IAuthData } from '@auth/service';
import * as Assert from 'assert';
import * as Boom from 'boom';
import { Plugin, Request, ResponseToolkit, Server } from 'hapi';
import * as Joi from 'joi';

export interface IAuthBearerOption {
    accessTokenName: string;
    allowQueryToken: boolean;
    allowCookieToken?: boolean;
    allowMultipleHeaders?: boolean;
    allowChaining?: false;
    tokenType?: 'Bearer';
    unauthorized?: typeof Boom.unauthorized;
    validate(request: Request, token: string, h: ResponseToolkit)
        : Promise<IAuthData>;
    redirect?(request: Request): string;
}

const defaultSettings: IAuthBearerOption = {
    accessTokenName: 'access_token',
    allowQueryToken: false,
    allowCookieToken: false,
    allowMultipleHeaders: false,
    allowChaining: false,
    tokenType: 'Bearer',
    unauthorized: Boom.unauthorized,
    validate: null,
};

const schemaValidator = Joi.object().keys({
    accessTokenName: Joi.string().required(),
    allowQueryToken: Joi.boolean(),
    allowCookieToken: Joi.boolean(),
    allowMultipleHeaders: Joi.boolean(),
    allowChaining: Joi.boolean(),
    tokenType: Joi.string().required(),
    unauthorized: Joi.func(),
    validate: Joi.func().required(),
    redirect: Joi.func().optional(),
});

function registerScheme(server: Server, options: IAuthBearerOption) {

    const settings = { ...defaultSettings, ...options };
    Joi.assert(settings, schemaValidator);

    const headerRegExp = new RegExp(settings.tokenType + '\\s+([^;$]+)', 'i');
    async function authenticate(request: Request, h: ResponseToolkit) {
        let authorization = request.raw.req.headers.authorization;
        const redirect_url = options.redirect ? options.redirect(request) : null;
        const redirect = () => {
            return h.response('You are being redirected...')
                .takeover().redirect(redirect_url);
        };
        if (settings.allowCookieToken
            && !authorization
            && request.state[settings.accessTokenName]) {
            authorization = `${settings.tokenType} ${request.state[settings.accessTokenName]}`;
        }

        if (settings.allowQueryToken
            && !authorization
            && request.query[settings.accessTokenName]) {
            authorization = `${settings.tokenType} ${request.query[settings.accessTokenName]}`;
            delete request.query[settings.accessTokenName];
        }

        if (!authorization) {
            // missing authorization
            if (redirect_url) {
                return redirect();
            }
            return settings.unauthorized(null, settings.tokenType);
        }

        if (settings.allowMultipleHeaders) {
            const headers = authorization.match(headerRegExp);
            if (headers !== null) {
                authorization = headers[0];
            }
        }

        const [tokenType, token] = authorization.split(/\s+/);

        if (!token
            || tokenType.toLowerCase() !== settings.tokenType.toLowerCase()) {
            // wrong token type
            if (redirect_url) {
                return redirect();
            }
            throw settings.unauthorized(null, settings.tokenType);
        }

        const { isValid, credentials, artifacts }
            = await settings.validate(request, token, h);

        if (!isValid) {
            const message = 'Bad token';
            // if (settings.allowChaining) {
            //     const routeSettings = request.route.settings.auth;
            //     const auth = routeSettings || request.server.auth.lookup(request.route);
            //     if (auth.strategies.length > 1) {
            //         message = null;
            //     }
            // }

            // invalid token
            if (redirect_url) {
                return redirect();
            }

            return h.unauthenticated(
                settings.unauthorized(message, settings.tokenType),
                { credentials, artifacts },
            );
        }

        if (!credentials
            || typeof credentials !== 'object') {
            // token has no associated credentials
            if (redirect_url) {
                return redirect();
            }
            throw h.unauthenticated(
                Boom.badImplementation('Bad token string received for Bearer auth validation'),
                { credentials: {} },
            );
        }

        return h.authenticated({ credentials, artifacts });
    }

    const scheme = { authenticate };

    return scheme;
}

export const SchemeName = 'bearer-access-token';

export const plugin: Plugin<any> = {
    name: 'hapi-auth-bearer',
    register(server: Server) {
        server.auth.scheme(SchemeName, registerScheme);
    },
};
