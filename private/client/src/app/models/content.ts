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

  export interface Repo {
    Create(name: string): Promise<string>;
    List(): Promise<Content[]>;
    Get(id: string): Promise<Content>;
    Patch(id: string, page: string, obj: ObjNS.Patch): Promise<number>;
  }
}
