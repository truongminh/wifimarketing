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
    pages: { [index: string]: Page };
  }

  export abstract class Repo {
    abstract Create(name: string): Promise<string>;
    abstract List(): Promise<Content[]>;
    abstract Get(id: string): Promise<Content>;
    abstract Patch(id: string, page: string, obj: ObjNS.Patch): Promise<number>;
  }
}
