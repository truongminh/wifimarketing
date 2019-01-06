import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ObjectPannelComponent } from './object-pannel/object-pannel.component';
import { PropertiesComponent } from './properties/properties.component';
import { PageViewerComponent } from './page-viewer/page-viewer.component';

@NgModule({
  declarations: [HeaderComponent, ObjectPannelComponent, PropertiesComponent, PageViewerComponent],
  imports: [
    CommonModule
  ]
})
export class UIModule { }
