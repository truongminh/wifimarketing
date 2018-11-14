import { Server } from 'hapi';
import * as AuthBasic from './hapi-auth-basic';
import { users } from './users';

const validate = async (request, username, password, h) => {
    if (username === 'help') {
        return { response: h.redirect(`${h.context.base_url}/help}`) };     // custom response
    }

    const user = users.find((u) => u.username === username);
    if (!user) {
        return { credentials: null, isValid: false };
    }

    const isValid = user.password === password;
    const credentials = { username };

    return { isValid, credentials };
};

export async function AddBasicStrategy(server: Server, name: string) {
    await server.register(AuthBasic);
    const settings = { validate };
    server.auth.strategy(name, AuthBasic.SchemeName, settings);
}
