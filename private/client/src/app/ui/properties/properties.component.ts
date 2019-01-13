import { Subscription } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ObjNS } from 'src/app/domain/obj';
import { ObjsService } from 'src/app/objs/objs.service';
import { ContentNS } from 'src/app/domain/content';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {

  constructor(
    private objsService: ObjsService,
  ) { }

  obj: ObjNS.Obj;
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.objsService.focus$.subscribe(focus => {
      this.obj = focus;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  onPropertyChange() {
    this.objsService.content$.next(this.objsService.content$.value);
  }

  onDelete(obj: ObjNS.Obj) {
    this.objsService.Delete(obj);
  }

}
