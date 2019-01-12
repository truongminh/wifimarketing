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
  selectedPage: string = '';
  selectedObj: string = '';
  propertyChange$ = new BehaviorSubject(null);
  private subscription: Subscription[] = [];
  setObj(objID: string) {
    this.selectedObj = objID;
  }

  changeRect(objId: string, rect: ObjNS.Obj['rect']) {

  }

}
