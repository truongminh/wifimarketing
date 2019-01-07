import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContentNS } from '../domain/content';
@Injectable({
  providedIn: 'root'
})
export class ContentResolver implements Resolve<ContentNS.Content> {
  constructor(private repo: ContentNS.Repo) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> | any {
    return this.repo.Get(route.params.content_id);
  }
}
