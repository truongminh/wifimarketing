import { Directive, ViewContainerRef, Input, ComponentFactoryResolver, ElementRef, Renderer2 } from '@angular/core';
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
    private render: Renderer2
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
      const elRef = componentRef.injector.get(ElementRef) as ElementRef;
      const rect = data.rect || {};
      const el = elRef.nativeElement as HTMLElement;
      const { x, y, w, h } = rect;
      this.render.setStyle(el, 'position', 'absolute');
      this.render.setStyle(el, 'top', `${y || 0}px`);
      this.render.setStyle(el, 'left', `${x || 0}px`);
      this.render.setStyle(el, 'width', `${w || 20}px`);
      this.render.setStyle(el, 'height', `${h || 20}px`);
    }
  }

}
