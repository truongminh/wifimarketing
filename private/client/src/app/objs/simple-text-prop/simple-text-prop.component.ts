import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ObjsService } from '../objs.service';
import { ObjNS } from 'src/app/domain/obj';

@Component({
  selector: 'app-simple-text-prop',
  templateUrl: './simple-text-prop.component.html',
  styleUrls: ['./simple-text-prop.component.scss']
})
export class SimpleTextPropComponent {

  constructor(
    private objsService: ObjsService,
  ) { }

  obj: ObjNS.Text;
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.objsService.focus$.subscribe(textOBJ => { this.obj = textOBJ as ObjNS.Text });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  onPropChange() {
    const newContent = this.objsService.content$.value;
    newContent.pages[this.objsService.selectedPage$.value].objs[this.objsService.focus$.value.id] = this.obj;
    this.objsService.content$.next(newContent);
    this.objsService.focus$.next(this.obj);
  }

}
