import { Injectable } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from '../domain/obj';

@Injectable({
  providedIn: 'root'
})
export class ObjsService {

  constructor(
    private repo: ContentNS.Repo,
  ) { }

  content: ContentNS.Content;
  selectedPage = '';

  setInitContent() {
    this.content = this.repo.List()[0];
    if (this.content && Object.keys(this.content.pages).length) {
      this.selectedPage = Object.keys(this.content.pages)[0]
    }
  }

  pushObj(obj: ObjNS.Text | ObjNS.Image | ObjNS.Input) {
    this.content[obj.id] = obj;
  }
}
