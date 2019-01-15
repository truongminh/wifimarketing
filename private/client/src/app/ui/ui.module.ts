import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { ObjectPannelComponent } from './object-pannel/object-pannel.component';
import { PropertiesComponent } from './properties/properties.component';
import { PageViewerComponent } from './page-viewer/page-viewer.component';
import { RouterModule } from '@angular/router';
import { DeskComponent } from './desk/desk.component';
import { ObjsModule } from '../objs/objs.module';
import { ObjsService } from '../objs/objs.service';
import { SimpleTextComponent } from '../objs/simple-text/simple-text.component';
import { SimpleImgComponent } from '../objs/simple-img/simple-img.component';
import { StatusComponent } from './status/status.component';
import { ObjPropComponent } from './obj-prop/obj-prop.component';

@NgModule({
  declarations: [
    HeaderComponent, ObjectPannelComponent, PropertiesComponent,
    PageViewerComponent, DeskComponent, StatusComponent, ObjPropComponent
  ],
  imports: [
    CommonModule, RouterModule, FormsModule, ObjsModule,
  ],
  exports: [
    HeaderComponent, ObjectPannelComponent, PropertiesComponent,
    PageViewerComponent, DeskComponent
  ],
  providers: [ObjsService],
  entryComponents: [
    SimpleTextComponent,
    SimpleImgComponent,
  ]
})
export class UIModule { }
