import { ICampaignRepo } from '@service/campaigns';
import { Server } from 'hapi';

const CampaignRepoSymbol = Symbol(`campaign_repo`);

export async function SetCampaignRepo(server: Server, repo: ICampaignRepo) {
    Object.defineProperty(server.app, CampaignRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetCampaignRepo(server: Server) {
    return server.app[CampaignRepoSymbol] as ICampaignRepo;
}
