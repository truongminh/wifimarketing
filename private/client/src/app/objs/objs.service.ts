import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentNS } from 'src/app/domain/content';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ObjNS } from '../domain/obj';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObjsService {

  constructor(
    private route: ActivatedRoute,
    private repo: ContentNS.Repo
  ) { }

  content$ = new BehaviorSubject<ContentNS.Content>(null);
  selectedPage$ = new BehaviorSubject<string>(null);
  page$ = this.content$.pipe(
    switchMap(content => this.selectedPage$.pipe(
      map(selectedPage => content.pages[selectedPage])
    )),
  )
  focus$ = new BehaviorSubject<ObjNS.Obj>(null);
  propertyChange$ = new BehaviorSubject(null);

  Patch(contentId: string, pageId: string, obj: ObjNS.Patch) {
    this.repo.PatchObj(contentId, pageId, obj);
    const focus = this.focus$.value;
    if (focus && focus.id === obj.id) {
      Object.assign(focus, obj);
      this.focus$.next(focus);
    }
  }

  Add(contentId: string, pageId: string, obj: ObjNS.Obj) {
    this.repo.PatchObj(contentId, pageId, obj);
    this.focus$.next(obj);
  }

  Delete(contentId: string, page: ContentNS.Page, obj: ObjNS.Obj) {
    const focus = this.focus$.value;
    if (focus && focus.id === obj.id) {
      this.focus$.next(null);
    }
    delete page.objs[obj.id];
    this.repo.PatchPage(contentId, page);
  }

}
