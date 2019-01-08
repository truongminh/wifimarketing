import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTextComponent } from './simple-text/simple-text.component';
import { SimpleImgComponent } from './simple-img/simple-img.component';
import { ObjsHostDirective } from './objs-host.directive';

@NgModule({
  declarations: [
    SimpleTextComponent, SimpleImgComponent, ObjsHostDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SimpleTextComponent, SimpleImgComponent, ObjsHostDirective
  ]
})
export class ObjsModule { }
