/********************************************** */
import * as ModuleAlias from 'module-alias';
// Add module alias
// see tsconfig.json > compilerOptions > paths
ModuleAlias.addAlias('@src', __dirname);
const aliases = ['api', 'common', 'lib', 'service', 'web', 'auth'];
aliases.forEach((k) => ModuleAlias.addAlias(`@${k}`, `${__dirname}/${k}`));

/********************************************** */
import { StartServer } from './bootstrap';
import { config } from './config';
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

async function main() {
    await StartServer(config);
}

main();
