import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from '../pages/list/list.component';
import { EditComponent } from '../pages/edit/edit.component';
import { PagesModule } from '../pages/pages.module';
import { ContentResolver } from './ContentResolver';

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
