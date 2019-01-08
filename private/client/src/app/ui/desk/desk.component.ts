import { Component, Input } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from 'src/app/domain/obj';

@Component({
  selector: 'app-desk',
  templateUrl: './desk.component.html',
  styleUrls: ['./desk.component.scss']
})
export class DeskComponent {

  constructor() { }

  @Input() set page(data: ContentNS.Page) {
    if (data) {
      this.objs = Object.keys(data.objs).map(key => data.objs[key]);
    }
  };
  objs: ObjNS.Obj[] = [];

}
