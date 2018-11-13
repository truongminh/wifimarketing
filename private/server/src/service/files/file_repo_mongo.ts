
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import * as Assert from 'assert';
import * as Boom from 'boom';
import { Db } from 'mongodb';
import { IFileEntry, IFileEntryCreate, IFileRepo } from './file_model';

export class FileRepoMongo extends RepoMongo<IFileEntry> implements IFileRepo {
    protected get projection(): ProjectionMongo<IFileEntry> {
        return {
            _id: 1, name: 1, type: 1, path: 1, bytes: 1, ctime: 1,
        };
    }
    public static getType(mime: string) {
        if (typeof mime !== 'string') {
            return 'binary';
        }
        if (mime.startsWith('text')) {
            return 'text';
        } else if (mime.startsWith('image')) {
            return 'image';
        } else if (mime.startsWith('video')) {
            return 'video';
        }
        return 'binary';
    }

    constructor(db: Db) {
        super(db, 'files');
    }

    public async Create({
        mime, name, path, bytes,
    }: IFileEntryCreate): Promise<string> {
        Assert(typeof name === 'string', 'name must be a string');
        if (path.length < 1) {
            throw Boom.badRequest('path is required');
        }
        const type = FileRepoMongo.getType(mime);
        return await this.__createOne({
            type, name, path, bytes,
        });
    }

    public async Search(q?: string): Promise<IFileEntry[]> {
        const filter = {};
        if (q) {
            filter['name'] = {
                $regex: q,
                $options: 'i',
            };
        }
        return this.__find(filter);
    }
}
