import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from 'src/app/domain/obj';
import { ObjsService } from 'src/app/objs/objs.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-desk',
  templateUrl: './desk.component.html',
  styleUrls: ['./desk.component.scss']
})
export class DeskComponent {

  constructor(
    private objsService: ObjsService,
  ) { }

  objs = this.objsService.page$.pipe(
    map(page => Object.values(page.objs))
  );

  ngOnInit(): void {

  }

  onUnfocus() {
    this.objsService.focus$.next(null);
  }
}
