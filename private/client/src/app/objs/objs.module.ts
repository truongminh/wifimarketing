import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTextComponent } from './simple-text/simple-text.component';
import { SimpleImgComponent } from './simple-img/simple-img.component';

@NgModule({
  declarations: [
    SimpleTextComponent, SimpleImgComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SimpleTextComponent, SimpleImgComponent
  ]
})
export class ObjsModule { }
