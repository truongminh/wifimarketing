import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from 'src/app/domain/obj';
import { ObjsService } from 'src/app/objs/objs.service';


@Component({
  selector: 'app-object-pannel',
  templateUrl: './object-pannel.component.html',
  styleUrls: ['./object-pannel.component.scss']
})
export class ObjectPannelComponent {
  types = ['text', 'image', 'input:text'];
  @Input() content: ContentNS.Content;
  @Input() page: ContentNS.Page;
  @Output() add = new EventEmitter<ObjNS.Obj>();

  constructor(
    private objService: ObjsService,
  ) { }

  private newText() {
    const id = Math.random().toString(36).substr(3, 6);
    const objCount = Object.keys(this.page.objs).length;
    const name = `text:${objCount + 1}`;
    const obj: ObjNS.Text = {
      id, name,
      type: 'text',
      attrs: { text: name },
      rect: { x: 30, y: 30, w: 100, h: 20 },
      style: {
        zIndex: `${objCount}`,
        fontSize: '20px'
      }
    };
    return obj;
  }

  addObj(type: 'text' | 'image') {
    const obj = this.newText();
    this.add.next(obj);
  }

}
