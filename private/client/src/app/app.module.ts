import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ObjsModule } from './objs/objs.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, ObjsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
