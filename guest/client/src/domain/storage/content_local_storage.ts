import { ContentNS } from "../content";

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
  
  private getContent(id: string) {
    return GetJSON<ContentNS.Content>(`__content_${id}`);
  }

  async Get(id: string) {
    return this.getContent(id);
  }
}
