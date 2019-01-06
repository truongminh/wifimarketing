import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { EditComponent } from './pages/edit/edit.component';
import { PagesModule } from './pages/pages.module';
import { ContentNS } from './domain/content';

@Injectable({
  providedIn: 'root'
})
class ContentResolver implements Resolve<ContentNS.Content> {
  constructor(private repo: ContentNS.Repo) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): |Promise<any> | any {
    return this.repo.Get(route.params.content_id);
  }
}

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ListComponent },
  {
    path: ':content_id/:page_id',
    component: EditComponent,
    resolve: {
      content: ContentResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), PagesModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
