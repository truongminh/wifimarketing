import { Component, OnInit } from '@angular/core';
import { ObjsService } from 'src/app/objs/objs.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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

  content$ = this.objsService.content$
  page$ = this.content$.pipe(
    map(content => content.pages[Object.keys(content.pages).find(key => key === this.objsService.selectedPage)]),
  );
  object$ = this.page$.pipe(
    map(page => page.objs[Object.keys(page.objs).find(key => key === this.objsService.selectedObj)]),
  );

  ngOnInit() {
    this.objsService.content$.next(this.route.snapshot.data.content);
    this.route.params.subscribe(params => {
      if (params.page_id) {
        this.objsService.setPage(this.route.snapshot.data.content.pages[params.page_id].id);
      }
    });
    this.objsService.setObj(Object.keys(this.route.snapshot.data.content.pages[this.objsService.selectedPage].objs)[0]);
  }

}
