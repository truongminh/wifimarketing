import { Directive, ViewContainerRef, Input, ComponentFactoryResolver } from '@angular/core';
import { SimpleTextComponent } from './simple-text/simple-text.component';
import { SimpleImgComponent } from './simple-img/simple-img.component';
import { ObjNS } from '../domain/obj';

const mapComp = {
  text: SimpleTextComponent,
  image: SimpleImgComponent,
  // input: SimpleTextComponent,
}

@Directive({
  selector: '[objsHost]'
})
export class ObjsHostDirective {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private ref: ViewContainerRef,
  ) { }

  @Input() set data(data: ObjNS.Obj) {
    if (data) {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(mapComp[data.type]);
      let componentRef = this.ref.createComponent(componentFactory);
      componentRef.instance['data'] = data;
    }
  }

}
