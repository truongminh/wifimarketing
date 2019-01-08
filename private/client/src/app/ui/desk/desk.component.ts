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

  data = {
    text: 'client',
    style: {
      fontSize: '50px'
    }
  }
  @Input() set page(pageData: ContentNS.Page) {
    if (!pageData || !pageData.objs) {
      return;
    }
    this.textObjs = [];
    Object.keys(pageData.objs).forEach(key => {
      switch (pageData.objs[key].type) {
        case 'text':
          this.textObjs.push(pageData.objs[key] as ObjNS.Text);
          break;
        case 'image':
          this.imageObjs.push(pageData.objs[key] as ObjNS.Image);
          break;
        case 'input':
          this.inputObjs.push(pageData.objs[key] as ObjNS.Input);
          break;
        default:
          break;
      }
    })
  }
  textObjs: ObjNS.Text[] = [];
  imageObjs: ObjNS.Image[] = [];
  inputObjs: ObjNS.Input[] = [];

}
