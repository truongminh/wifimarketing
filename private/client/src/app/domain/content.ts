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

  export function AddObj(page: Page, obj: ObjNS.Obj) {
    const id = Math.random().toString(36).substr(3, 6);
    obj.id = id;
    const list = Object.values(page.objs);
    obj.style = obj.style || {};
    console.log(list);
    const lastObj = list.length > 0 ? Math.max(...list.map(o => o.nth)) : 0;
    const nth = (lastObj || 0) + 1;
    obj.nth = nth;
    obj.style.zIndex = `${nth}`;
    obj.name = `${obj.name}:${nth}`;
    page.objs[obj.id] = obj;
  }
}
