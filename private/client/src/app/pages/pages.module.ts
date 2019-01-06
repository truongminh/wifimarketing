import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ListComponent, EditComponent],
  entryComponents: [ListComponent, EditComponent],
  imports: [
    CommonModule, RouterModule
  ]
})
export class PagesModule { }
