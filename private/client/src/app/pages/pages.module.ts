import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { RouterModule } from '@angular/router';
import { UIModule } from '../ui/ui.module';
import { ObjsService } from '../objs/objs.service';

@NgModule({
  declarations: [ListComponent, EditComponent],
  exports: [ListComponent, EditComponent],
  imports: [
    CommonModule, RouterModule, UIModule
  ],
  providers: [ObjsService]
})
export class PagesModule { }
