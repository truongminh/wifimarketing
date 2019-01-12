import { Component, OnInit } from '@angular/core';
import { ObjsService } from 'src/app/objs/objs.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from 'src/app/domain/obj';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private objsService: ObjsService,
  ) { }

  content: ContentNS.Content;
  page: ContentNS.Page;
  obj = this.objsService.focus;
  ngOnInit() {
    this.content = this.route.snapshot.data.content;
    this.route.params.subscribe(params => {
      if (params.page_id) {
        this.page = this.content.pages[params.page_id];
      }
    });
  }
}
