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
    abstract Get(id: string): Promise<Content>;
  }
}
