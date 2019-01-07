import { Component, OnInit, Input } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjsService } from '../../objs/objs.service';

@Component({
  selector: 'app-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.scss']
})
export class PageViewerComponent implements OnInit {
  pages: ContentNS.Page[];
  contentId: string;
  @Input() set content(data: ContentNS.Content) {
    if (data) {
      this.contentId = data.id;
      this.pages = Object.keys(data.pages).map(id => data.pages[id]);
    }
  };
  constructor(
    private repo: ContentNS.Repo,
    private objsService: ObjsService,
  ) { }

  ngOnInit() {
  }

  addPage(el: HTMLInputElement) {
    const pageName = el.value;
    const id = Math.random().toString(36).substr(3, 6);
    const page: ContentNS.Page = {
      id,
      name: pageName,
      objs: {}
    };
    this.repo.PatchPage(this.contentId, page);
    this.pages.push(page);
    el.value = '';
  }
}
