import * as Assert from 'assert';
import * as Boom from 'boom';
import { Db, FilterQuery } from 'mongodb';
import * as ShortId from 'shortid';

export type ProjectionMongo<T> = {
    [P in Exclude<keyof T, 'id'>]?: 1;
} & { _id?: 1 };

export type RowMongo<T> = Pick<T, Exclude<keyof T, 'id'>>
    & { _id: string, ctime: Date, mtime: Date };

export class RepoMongo<T extends { id: string }> {
    protected __C = this.db.collection<RowMongo<T>>(this.colName);
    protected get projection(): ProjectionMongo<T> {
        return {};
    }
    constructor(protected db: Db, private colName: string) { }

    public async Read(id: string, projection = this.projection): Promise<T | null> {
        Assert(typeof id === 'string', 'id must be a string');
        const res = await this.__C.findOne({ _id: id }, { projection });
        if (!res) {
            return null;
        }
        return this.MapID(res);
    }

    public async Delete(id: string): Promise<number> {
        const res = await this.__C.deleteOne({ _id: id });
        if (!res) {
            return 0;
        }
        return res.deletedCount;
    }

    protected MapID(t: RowMongo<T>): T {
        const { _id, ...res } = t as any;
        return ({ id: _id, ...res });
    }

    protected async __find(filter: FilterQuery<T> = {}, projection = this.projection): Promise<T[]> {
        const data = await this.__C.find(filter, { projection }).toArray();
        return data.map((v) => this.MapID(v));
    }

    protected async __findOne(filter: FilterQuery<T> = {}, projection = this.projection): Promise<T | null> {
        const data = await this.__C.findOne(filter, { projection });
        if (!data) {
            return null;
        }
        return this.MapID(data);
    }

    protected async __updateByID(id: string, data: Partial<T>): Promise<number> {
        Assert(typeof id === 'string', 'id must be a string');
        Object.keys(data).forEach((k) => {
            if (data[k] === undefined) {
                delete data[k];
            }
        });
        if (Object.keys(data).length > 0) {
            const $set = data as any;
            $set.mtime = new Date();
            const res = await this.__C.updateOne({ _id: id }, { $set });
            if (!res) {
                return 0;
            }
            return res.modifiedCount;
        }
        return 0;
    }

    protected async __createOne(data: Partial<T>) {
        const id = ShortId.generate();
        const ctime = new Date();
        const mtime = ctime;
        const res = data as any;
        await this.__C.insertOne({
            _id: id, ...res, ctime, mtime,
        });
        return id;
    }

    protected async __count(filter: FilterQuery<T> = {}) {
        return this.__C.count(filter);
    }

    protected async __readOrThrow(id: string) {
        const row = await this.Read(id);
        if (!row) {
            throw Boom.badRequest(`${id} not exist`);
        }
        return row;
    }
}
