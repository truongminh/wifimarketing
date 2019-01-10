import { Component, Input } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from 'src/app/domain/obj';


@Component({
  selector: 'app-object-pannel',
  templateUrl: './object-pannel.component.html',
  styleUrls: ['./object-pannel.component.scss']
})
export class ObjectPannelComponent {
  types = ['text', 'image'];
  @Input() content: ContentNS.Content;
  @Input() page: ContentNS.Page;

  constructor(
    private repo: ContentNS.Repo,
  ) { }

  private newText() {
    const id = Math.random().toString(36).substr(3, 6);
    const name = `text`;
    const obj: ObjNS.Text = {
      id, name,
      type: 'text',
      attrs: { text: name },
      rect: { x: 30, y: 30, w: 100, h: 20 },
      style: {
        fontSize: '20px'
      }
    };
    return obj;
  }

  addObj(type: 'text' | 'image') {
    const obj = this.newText();
    this.repo.PatchObj(this.content.id, this.page.id, obj);
  }

}
