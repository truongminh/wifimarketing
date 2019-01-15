import { Component, OnInit } from '@angular/core';
import { ObjsService } from './../../objs/objs.service';

@Component({
  selector: 'app-obj-prop',
  templateUrl: './obj-prop.component.html',
  styleUrls: ['./obj-prop.component.scss']
})
export class ObjPropComponent implements OnInit {

  constructor(
    public objsService: ObjsService,
  ) { }


  ngOnInit() {
  }

}
