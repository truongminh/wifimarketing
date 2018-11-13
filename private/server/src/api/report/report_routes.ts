import { Server } from 'hapi';
import { SetReportHistoryRoutes } from './history_routes';
import { GetReportRepo } from './report_context';

export async function SetReportsApiRoutes(server: Server) {
    const repo = await GetReportRepo(server);
    await SetReportHistoryRoutes(server, repo);
}
