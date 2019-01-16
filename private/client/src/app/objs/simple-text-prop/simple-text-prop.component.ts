import { Component, Input } from '@angular/core';
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

  @Input() obj: ObjNS.Text;

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  onPropChange() {
    this.objsService.Patch(this.obj);
  }

}
