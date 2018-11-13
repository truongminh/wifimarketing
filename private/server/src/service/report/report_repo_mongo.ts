import { IPlaceRepo } from '@service/places';
import { Db } from 'mongodb';
import { HistoryRepoMongo } from './history_repo_mongo';
import { IHistory, IHistoryFilter, IQueryOptions, IReportRepo } from './report_model';

export class ReportRepoMongo implements IReportRepo {
    public History = new HistoryRepoMongo(this.db, this.placeRepo);
    constructor(
        private db: Db,
        private placeRepo: IPlaceRepo,
    ) { }

}
