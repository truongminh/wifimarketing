import { Directive, ViewContainerRef, Input, ComponentFactoryResolver } from '@angular/core';
import { SimpleTextComponent } from './simple-text/simple-text.component';
import { SimpleImgComponent } from './simple-img/simple-img.component';
import { ObjNS } from '../domain/obj';

interface TypeObjComponent {
  new(): { data: ObjNS.Obj };
}

const componentMap = new Map<string, TypeObjComponent>();
componentMap.set('text', SimpleTextComponent);
componentMap.set('image', SimpleImgComponent);

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
      const componentType = componentMap.get(data.type);
      if (!componentType) {
        return;
      }
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
      let componentRef = this.ref.createComponent(componentFactory, 0);
      componentRef.instance.data = data;
    }
  }

}
