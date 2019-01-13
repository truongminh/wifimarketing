import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from 'src/app/domain/obj';
import { ObjsService } from 'src/app/objs/objs.service';

const text: ObjNS.Text = {
  id: null,
  name: 'text',
  type: 'text',
  attrs: { text: 'text' },
  rect: { x: 30, y: 30, w: 100, h: 20 },
  style: {
    fontSize: '20px'
  }
};

const image: ObjNS.Image = {
  id: null,
  name: 'image',
  type: 'image',
  attrs: {
    src: ''
  },
  rect: { x: 30, y: 30, w: 100, h: 20 },
};

@Component({
  selector: 'app-object-pannel',
  templateUrl: './object-pannel.component.html',
  styleUrls: ['./object-pannel.component.scss']
})
export class ObjectPannelComponent {
  types: ObjNS.Obj[] = [text, image];

  constructor(
    private objService: ObjsService,
  ) { }

  addObj(obj: ObjNS.Obj) {
    this.objService.Add(obj);
  }

}
