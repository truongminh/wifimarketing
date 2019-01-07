import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { ContentNS } from './domain/content';
import { ContentLocalStorage } from './domain/storage/content_local_storage';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, AppRoutingModule
  ],
  providers: [
    {
      provide: ContentNS.Repo,
      useClass: ContentLocalStorage
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
