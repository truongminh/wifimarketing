import { GetAuthRepo, IAuthArtifacts, IAuthCredentials, IAuthData } from '@auth/service';
import { GetConfig } from '@common/server';
import { Request, ResponseToolkit, Server } from 'hapi';
import * as AuthBearer from './bearer_access_token';
export { SchemeName } from './bearer_access_token';

export async function AddBearerStrategy(
    server: Server,
    accessTokenName = 'access_token',
    name: string,
    redirect_name: string,
) {
    await server.register(AuthBearer);
    const authRepo = await GetAuthRepo(server);
    const validate = async (request: Request, token: string, h: ResponseToolkit): Promise<IAuthData> => {
        const session = await authRepo.ReadSession(token);
        const isValid = session != null;
        if (!isValid) {
            return { isValid };
        }
        const { id: session_id, user, org } = session;
        const credentials: IAuthCredentials = {
            user,
        };
        const artifacts: IAuthArtifacts = {
            session_id, token, org,
        };
        return { isValid, credentials, artifacts };
    };

    // api
    const apiAuthOptions: AuthBearer.IAuthBearerOption = {
        accessTokenName,
        allowQueryToken: true,
        allowCookieToken: true,
        validate,
    };
    server.auth.strategy(name, AuthBearer.SchemeName, apiAuthOptions);
    // web
    const config = await GetConfig(server);
    const { base_url } = config.server;
    const redirect = (request: Request) => {
        const protocol = request.headers['x-forwarded-proto'] || request.url.protocol || 'http';
        const [_, via] = (request.headers['via'] || '').split(' ');
        const host = (via || '').trim() || request.info.host;
        const path = `${base_url}${request.url.path.substr(1)}`;
        const url = `${protocol}://${host}${path}`;
        return `${config.server.base_url}login?redirect=${encodeURIComponent(url)}`;
    };
    const webAuthOptions: AuthBearer.IAuthBearerOption = {
        accessTokenName,
        allowQueryToken: true,
        allowCookieToken: true,
        validate,
        redirect,
    };
    server.auth.strategy(redirect_name, AuthBearer.SchemeName, webAuthOptions);
}
