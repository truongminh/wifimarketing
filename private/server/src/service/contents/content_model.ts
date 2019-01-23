import { ObjNS } from "./obj";

export namespace ContentNS {
    export interface Page {
        id: string;
        name: string;
        objs: { [index: string]: ObjNS.Obj };
    }

    export interface Content {
        id: string;
        name: string;
        org_id: string;
        pages: { [index: string]: Page };
    }

    export interface IContentCreate {
        name: string;
        org_id: string;
    }

    export type IContentUpdate = Partial<Content>;

    export interface Repo {
        Create(data: IContentCreate): Promise<string>;
        Read(id: string): Promise<Content>;
        Update(id: string, data: IContentUpdate): Promise<number>;
        ByOrg(org_id: string): Promise<Content[]>;
    }
}
