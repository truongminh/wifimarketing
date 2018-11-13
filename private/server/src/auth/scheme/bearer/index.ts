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
        const { id: session_id, org, user } = session;
        const credentials: IAuthCredentials = {
            user,
        };
        const artifacts: IAuthArtifacts = {
            session_id, org, token,
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
    const redirect = (request: Request) => {
        const url = (request.url.protocol || 'http')
            + '://'
            + request.info.host
            + request.url.path;
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
