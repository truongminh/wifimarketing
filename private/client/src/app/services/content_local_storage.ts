import { ContentNS } from "../models/content";
import { ObjNS } from "../models/obj";

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
    SetJSON(this.listKey, this.getContentIDs().push(id));
    return id;
  }

  async List() {
    return this.getContentIDs().map(id => this.getContent(id));
  }

  async Get(id: string) {
    return this.getContent(id);
  }

  async Patch(id: string, pageId: string, obj: ObjNS.Patch) {
    const c = this.getContent(id);
    Object.assign(c.pages[pageId][obj.id], obj);
    this.saveContent(id, c);
    return 1;
  }
}
