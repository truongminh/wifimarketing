import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SimpleTextComponent } from './simple-text/simple-text.component';
import { SimpleImgComponent } from './simple-img/simple-img.component';
import { ObjsHostDirective } from './objs-host.directive';
import { ObjInputModule } from './input/obj-input.module';
import { SimpleTextPropComponent } from './simple-text-prop/simple-text-prop.component';

@NgModule({
  declarations: [
    SimpleTextComponent, SimpleImgComponent, ObjsHostDirective,
    SimpleTextPropComponent
  ],
  imports: [
    CommonModule, 
    BrowserModule, FormsModule,
  ],
  exports: [
    SimpleTextComponent, SimpleImgComponent,
    SimpleTextPropComponent,
    ObjsHostDirective, ObjInputModule
  ]
})
export class ObjsModule { }
