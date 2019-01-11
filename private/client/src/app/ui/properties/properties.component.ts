import { Component, OnInit, Input } from '@angular/core';
import { ObjNS } from 'src/app/domain/obj';
import { ObjsService } from 'src/app/objs/objs.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  constructor(
    private objsService: ObjsService,
  ) { }

  @Input() set object(data: ObjNS.Obj) {
    console.log(data)
    this._object = data;
  }

  _object: ObjNS.Obj;

  ngOnInit() {
  }

  onPropertyChange() {
    // this.objsService
    // console.log('__________')
  }

  test() {
    this.objsService.propertyChange$.next(null);
  }

}
