import * as Assert from 'assert';
import { Server, ServerStateCookieOptions } from 'hapi';
import * as Joi from 'joi';

import { GetAuthRepo } from '@auth/service';
import { GetConfig } from '@common/server';

const cookieSettings: ServerStateCookieOptions = {
    isSameSite: false,
    isSecure: false,
    path: '/',
};

export async function SetAuthRoutes(server: Server) {
    const authRepo = await GetAuthRepo(server);
    const config = await GetConfig(server);
    const { token_name } = config.auth;
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
                return h.view('login');
            }
            const { username, password } = request.payload as { username: string, password: string };
            const reply = (message) => h.view('login', { message, username, password });

            if (!username || !password) {
                return reply('missing username or password');
            }

            const [user_code, org_code] = username.split('@');

            if (!user_code || !org_code) {
                return reply('username not exist');
            }

            try {
                const authData = await authRepo.ReadUser(org_code, user_code, password);
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
