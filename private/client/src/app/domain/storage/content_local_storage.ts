import { ContentNS } from "../content";
import { ObjNS } from "../obj";

function GetJSON<T>(key: string): T {
  const value = localStorage.getItem(key);
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function SetJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export class ContentLocalStorage implements ContentNS.Repo {
  private readonly listKey = '__content_list';
  private getContentIDs() {
    return GetJSON<string[]>(this.listKey) || [];
  }
  private getContent(id: string) {
    return GetJSON<ContentNS.Content>(`__content_${id}`);
  }
  private saveContent(id: string, content: ContentNS.Content) {
    SetJSON(`__content_${id}`, content);
  }

  async Create(name: string) {
    const id = Math.random().toString(36).substr(3, 6);
    const c: ContentNS.Content = { id, name, pages: {} };
    this.saveContent(id, c);
    const ids = this.getContentIDs();
    ids.push(id);
    SetJSON(this.listKey, ids);
    return id;
  }

  async List() {
    return this.getContentIDs().map(id => this.getContent(id));
  }

  async Get(id: string) {
    return this.getContent(id);
  }

  async PatchPage(id: string, page: Partial<ContentNS.Page>) {
    const c = this.getContent(id);
    c.pages[page.id] = Object.assign({}, c.pages[page.id], page);
    this.saveContent(id, c);
    return 1;
  }

  async PatchObj(id: string, pageId: string, obj: Partial<ObjNS.Obj>) {
    const c = this.getContent(id);
    const page = c.pages[pageId];
    if (page) {
      page.objs[obj.id] = Object.assign({}, page.objs[obj.id], obj);
      this.saveContent(id, c);
      return 1;
    }
    return 0;
  }
}
