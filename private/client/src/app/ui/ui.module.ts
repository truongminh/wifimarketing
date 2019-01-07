import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ObjectPannelComponent } from './object-pannel/object-pannel.component';
import { PropertiesComponent } from './properties/properties.component';
import { PageViewerComponent } from './page-viewer/page-viewer.component';
import { RouterModule } from '@angular/router';
import { DeskComponent } from './desk/desk.component';
import { ObjsModule } from '../objs/objs.module';

@NgModule({
  declarations: [
    HeaderComponent, ObjectPannelComponent, PropertiesComponent,
    PageViewerComponent, DeskComponent
  ],
  imports: [
    CommonModule, RouterModule, ObjsModule
  ],
  exports: [
    HeaderComponent, ObjectPannelComponent, PropertiesComponent,
    PageViewerComponent, DeskComponent
  ]
})
export class UIModule { }
