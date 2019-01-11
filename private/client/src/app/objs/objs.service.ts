import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentNS } from 'src/app/domain/content';
import { Subscription, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjsService {

  constructor(
    private route: ActivatedRoute
  ) { }

  content$: BehaviorSubject<ContentNS.Content> = new BehaviorSubject(null);
  selectedPage: string = '';
  selectedObj: string = '';
  propertyChange$ = new BehaviorSubject(null);
  private subscription: Subscription[] = [];

  setPage(pageID: string) {
    this.selectedPage = pageID;
  }

  setObj(objID: string) {
    this.selectedObj = objID;
  }
  
}
