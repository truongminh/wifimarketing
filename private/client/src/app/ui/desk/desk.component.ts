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
    private repo: ContentNS.Repo,
    private objsService: ObjsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  objs: ObjNS.Obj[] = [];
  private subscription: Subscription[] = [];

  ngOnInit(): void {
    this.subscription.push(
      // this.objsService.propertyChange$.subscribe(d => {
      //   this.objs = Array.from(this.objs);
      // }),
      this.objsService.page$.subscribe(page => { this.objs = Object.values(page.objs) }),
    );
  }

  Add(obj: ObjNS.Obj) {
    // this.objsService.Add(this.contentId, this.page.id, obj);
    // this.objs.push(obj);
    // this.page.objs[obj.id] = obj;
  }

  Delete(obj: ObjNS.Obj) {
    // this.objsService.Delete(this.contentId, this.page, obj);
    // const index = this.objs.findIndex(o => o.id === obj.id);
    // if (index !== -1) {
    //   this.objs.splice(index, 1);
    //   delete this.page.objs[obj.id];
    // }
  }

  onPatch(obj: ObjNS.Patch) {
    // this.objsService.Patch(this.contentId, this.page.id, obj);
  }

  onUnfocus() {
    this.objsService.focus$.next(null);
  }
}
