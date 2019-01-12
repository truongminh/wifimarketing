import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTextComponent } from './simple-text/simple-text.component';
import { SimpleImgComponent } from './simple-img/simple-img.component';
import { ObjsHostDirective } from './objs-host.directive';
import { ObjInputModule } from './input/obj-input.module';

@NgModule({
  declarations: [
    SimpleTextComponent, SimpleImgComponent, ObjsHostDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SimpleTextComponent, SimpleImgComponent, ObjsHostDirective,
    ObjInputModule
  ]
})
export class ObjsModule { }
