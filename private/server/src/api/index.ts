import { Server } from 'hapi';
import { SetAccessPointsApiRoutes } from './access_points';
import { SetCampaignsApiRoutes } from './campaigns';
import { SetContentsApiRoutes } from './contents';
import { SetFilesApiRoutes } from './files';
import { SetOrgsApiRoutes, SetUsersApiRoutes } from './orgs';
import { SetPlacesApiRoutes } from './places';
import { SetReportsApiRoutes } from './report';

export async function SetAPIRoutes(server: Server) {
    await SetFilesApiRoutes(server);
    // Org
    await SetOrgsApiRoutes(server);
    await SetUsersApiRoutes(server);

    // Business
    await SetPlacesApiRoutes(server);
    await SetAccessPointsApiRoutes(server);
    await SetContentsApiRoutes(server);
    await SetCampaignsApiRoutes(server);

    // Report
    await SetReportsApiRoutes(server);
}
