
import { ProjectionMongo, RepoMongo } from '@lib/db/mongo';
import * as Boom from 'boom';
import { Db, FilterQuery } from 'mongodb';
import { IPlace, IPlaceCreate, IPlaceRepo, IPlaceType, IPlaceUpdate } from './place_model';

export class PlaceRepoMongo extends RepoMongo<IPlace> implements IPlaceRepo {
    protected get projection(): ProjectionMongo<IPlace> {
        return {
            _id: 1, name: 1, code: 1, type: 1, parent: 1,
        };
    }

    constructor(db: Db) {
        super(db, 'places');
    }

    public async Create({ org_id, name, code, type, parent }: IPlaceCreate): Promise<string> {
        await this.checkParent(parent, type);
        await this.checkUniqueCodeAndType(org_id, code, type);
        return await this.__createOne({ org_id, name, code, type, parent });
    }

    public async Update(id: string, { name, code }: IPlaceUpdate): Promise<number> {
        if (code) {
            const current = await this.__readOrThrow(id);
            if (current.code !== code) {
                await this.checkUniqueCodeAndType(current.org_id, code, current.type);
            }
        }
        return this.__updateByID(id, { name, code });
    }

    public async Delete(id: string) {
        const existChild = await this.__count({ parent: id });
        if (existChild) {
            throw Boom.badRequest(`Cannot delete place ${id}, which has  ${existChild} children.`);
        }
        return super.Delete(id);
    }

    public async ByOrg(org_id: string): Promise<IPlace[]> {
        return this.__find({ org_id });
    }

    private async checkUniqueCodeAndType(org_id: string, code: string, type: IPlaceType) {
        const c = await this.__count({ org_id, code, type });
        if (c > 0) {
            throw Boom.badRequest(`${type} with code ${code} existed`);
        }
    }

    private async checkParent(parent: string, type: string) {
        switch (type) {
            case 'city':
                parent = '';
                break;
            case 'campus':
            case 'site':
                if (!parent) {
                    throw Boom.badRequest(`missing parent when create type ${type}`);
                }
                const parentCount = await this.__count({ _id: parent });
                if (parentCount < 1) {
                    throw Boom.badRequest(`parent ${parent} not exist, expect exist parent for type ${type}t`);
                }
                break;
            default:
                throw Boom.badRequest(`${type} is not supported`);
        }
    }
}
