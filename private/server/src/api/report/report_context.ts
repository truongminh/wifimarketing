import { IReportRepo } from '@service/report';
import { Server } from 'hapi';

const ReportRepoSymbol = Symbol(`report_repo`);

export async function SetReportRepo(server: Server, repo: IReportRepo) {
    Object.defineProperty(server.app, ReportRepoSymbol, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: repo,
    });
}

export async function GetReportRepo(server: Server) {
    return server.app[ReportRepoSymbol] as IReportRepo;
}
