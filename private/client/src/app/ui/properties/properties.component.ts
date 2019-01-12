import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ObjNS } from 'src/app/domain/obj';
import { ObjsService } from 'src/app/objs/objs.service';
import { ContentNS } from 'src/app/domain/content';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  constructor(
    private objsService: ObjsService,
  ) { }

  @Input() contentId: string;
  @Input() page: ContentNS.Page;
  @Input() obj: ObjNS.Obj;
  @Output() delete = new EventEmitter<ObjNS.Obj>();

  ngOnInit() {
  }

  onPropertyChange() {
    // this.objsService
    // console.log('__________')
  }

  onDelete(obj: ObjNS.Obj) {
    this.delete.next(obj);
  }

}
