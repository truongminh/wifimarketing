import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjsService } from '../../objs/objs.service';

@Component({
  selector: 'app-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.scss']
})
export class PageViewerComponent implements OnInit {
  pages: ContentNS.Page[];
  content: ContentNS.Content;
  private setContent(content: ContentNS.Content) {
    this.content = content;
    this.pages = Object.values(content.pages);
  }

  constructor(
    private repo: ContentNS.Repo,
    private objsService: ObjsService,
  ) { }

  ngOnInit() {
    this.objsService.content$.subscribe(content => {
      this.setContent(content);
    });
  }

  addPage(el: HTMLInputElement) {
    const pageName = el.value;
    const id = Math.random().toString(36).substr(3, 6);
    const page: ContentNS.Page = {
      id,
      name: pageName,
      objs: {}
    };
    this.repo.PatchPage(this.content.id, page);
    this.content.pages[page.id] = page;
    this.setContent(this.content);
    el.value = '';
  }
}
