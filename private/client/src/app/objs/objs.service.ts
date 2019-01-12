import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentNS } from 'src/app/domain/content';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ObjNS } from '../domain/obj';

@Injectable({
  providedIn: 'root'
})
export class ObjsService {

  constructor(
    private route: ActivatedRoute,
    private repo: ContentNS.Repo
    ) { }

  focus = new BehaviorSubject<ObjNS.Obj>(null);
  propertyChange$ = new BehaviorSubject(null);

  Patch(contentId: string, pageId: string, obj: ObjNS.Patch) {
    this.repo.PatchObj(contentId, pageId, obj);
    const focus = this.focus.value;
    if (focus && focus.id === obj.id) {
      Object.assign(focus, obj);
      this.focus.next(focus);
    }
  }

}
