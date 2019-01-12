import { Component, OnInit, Input } from '@angular/core';
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
