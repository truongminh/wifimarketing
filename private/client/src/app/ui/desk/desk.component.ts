import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { ContentNS } from 'src/app/domain/content';
import { ObjNS } from 'src/app/domain/obj';
import { ObjsService } from 'src/app/objs/objs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-desk',
  templateUrl: './desk.component.html',
  styleUrls: ['./desk.component.scss']
})
export class DeskComponent {

  constructor(
    private repo: ContentNS.Repo,
    private objsService: ObjsService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  @Input() contentId: string;
  private pageId: string;

  @Input() set page(data: ContentNS.Page) {
    if (data) {
      this.pageId = data.id;
      this.objs = Object.values(data.objs);
    } else {
      this.pageId = '';
      this.objs = [];
    }
  };
  objs: ObjNS.Obj[] = [];
  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.objsService.propertyChange$.subscribe(d => {
      this.objs = Array.from(this.objs);
    });
  }

  onPatch(obj: ObjNS.Patch) {
    this.repo.PatchObj(this.contentId, this.pageId, obj);
  }
}
