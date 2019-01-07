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
    abstract PatchPage(id: string, page: Partial<Page>): Promise<number>;
    abstract PatchObj(id: string, pageId: string, obj: Partial<ObjNS.Obj>): Promise<number>;
  }
}
