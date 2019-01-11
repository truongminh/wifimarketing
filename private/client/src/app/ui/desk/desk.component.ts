import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from 'src/app/domain/obj';
import { ObjsService } from 'src/app/objs/objs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-desk',
  templateUrl: './desk.component.html',
  styleUrls: ['./desk.component.scss']
})
export class DeskComponent {

  constructor(
    private objsService: ObjsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  @Input() set page(data: ContentNS.Page) {
    if (data) {
      this.objs = Object.keys(data.objs).map(key => data.objs[key]);
    }
  };
  objs: ObjNS.Obj[] = [];
  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.objsService.propertyChange$.subscribe(d => {
      console.log('__________', this.objs)
      this.objs = Array.from(this.objs);
    });
  }

}
