import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentNS } from 'src/app/domain/content';
import { BehaviorSubject } from 'rxjs';
import { ObjNS } from '../domain/obj';
import { map, switchMap, share, shareReplay } from 'rxjs/operators';

@Injectable()
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
    shareReplay(1)
  );

  focus$ = new BehaviorSubject<ObjNS.Obj>(null);
  propertyChange$ = new BehaviorSubject(null);

  Patch(obj: ObjNS.Patch) {
    const content = this.content$.value;
    const page = content.pages[this.selectedPage$.value];
    this.repo.PatchObj(content.id, page.id, obj);
    Object.assign(page.objs[obj.id], obj);
    this.content$.next(content);
  }

  Add(obj: ObjNS.Obj) {
    const content = this.content$.value;
    const page = content.pages[this.selectedPage$.value];
    this.repo.PatchPage(content.id, page);
    ContentNS.AddObj(page, obj);
    this.content$.next(content);
    this.focus$.next(obj);
  }

  Delete(obj: ObjNS.Obj) {
    const content = this.content$.value;
    const page = content.pages[this.selectedPage$.value];
    delete page.objs[obj.id];
    this.repo.PatchPage(content.id, page);
    this.content$.next(content);
    if (this.IsFocus(obj.id)) {
      this.focus$.next(null);
    }
  }

  IsFocus(objId: string) {
    return this.focus$.value && this.focus$.value.id === objId;
  }

}
