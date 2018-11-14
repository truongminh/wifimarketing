import * as Assert from 'assert';
import { Server, ServerStateCookieOptions } from 'hapi';
import * as Joi from 'joi';

import { GetAuthRepo, GetSessionUser } from '@auth/service';
import { GetConfig } from '@common/server';
import { loginPage } from './login_page';

const cookieSettings: ServerStateCookieOptions = {
    isSameSite: false,
    isSecure: false,
    path: '/',
};

export async function SetAuthWebRoutes(server: Server) {
    const authRepo = await GetAuthRepo(server);
    const config = await GetConfig(server);
    const { token_name, default_org } = config.auth;
    const { base_url } = config.server;
    server.route({
        path: '/login',
        method: ['GET', 'POST'],
        options: {
            auth: {
                mode: 'try',
            },
            validate: {
                query: {
                    redirect: Joi.string().optional().default(base_url),
                },
            },
        },
        handler: async (request, h) => {
            const { redirect } = request.query as { redirect: string };
            if (request.auth.isAuthenticated) {
                return h.redirect(redirect);
            }
            if (request.method === 'get') {
                return loginPage();
            }
            const { username, password } = request.payload as { username: string, password: string };
            const reply = (message) => loginPage({ message, username, password });

            if (!username || !password) {
                return reply('missing username or password');
            }

            const [input_user_code, input_org_code] = username.split('@');

            if (!input_user_code) {
                return reply('username not exist');
            }

            const org_code = input_org_code || default_org;

            if (!org_code) {
                return reply('missing org');
            }

            try {
                const authData = await authRepo.AuthenticateUser(org_code, input_user_code, password);
                if (!authData) {
                    return reply(`incorrect username or password`);
                }
                const { org, user } = authData;
                Assert(org, 'missing org');
                Assert(user, 'missing user');

                const session_id = await authRepo.CreateSession(org, user);
                h.state(token_name, session_id, cookieSettings);
                return h.redirect(redirect);
            } catch (e) {
                request.log('error', e);
                return reply('Some error occured. Please try again');
            }
        },
    });
    server.route({
        path: '/logout',
        method: 'GET',
        options: {
            auth: {
                mode: 'try',
            },
        },
        handler: async (request, h) => {
            const redirect = request.query['redirect'] || base_url;
            const sid = request.state[token_name];
            if (sid) {
                try {
                    await authRepo.DestroySession(sid);
                    h.unstate(token_name, cookieSettings);
                } catch (e) {
                    console.log('destroy session failed', e);
                }
            }
            return h.redirect(`./login?redirect=${encodeURIComponent(redirect)}`);
        },
    });
}
