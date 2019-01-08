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

  addObj(type: 'text' | 'image') {
    const id = Math.random().toString(36).substr(3, 6);
    const obj: ObjNS.Text = {
      id: id,
      type: 'text',
      name: type,
      attrs: { text: `text ${id}` },
      style: {
        position: 'absolute',
        top: '30px',
        left: '30px',
        fontSize: '20px'
      }
    };
    this.repo.PatchObj(this.content.id, this.page.id, obj);
  }

}
