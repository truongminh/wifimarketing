import { Directive, ViewContainerRef, Input, ComponentFactoryResolver, ElementRef, Renderer2, OnInit, Output, EventEmitter } from '@angular/core';
import { SimpleTextComponent } from './simple-text/simple-text.component';
import { SimpleImgComponent } from './simple-img/simple-img.component';
import { ObjNS } from '../domain/obj';
import { ObjsService } from './objs.service';
import { Subscription } from 'rxjs';

interface TypeObjComponent {
  new(): { data: ObjNS.Obj };
}

const componentMap = new Map<ObjNS.Obj['type'], TypeObjComponent>();
componentMap.set('text', SimpleTextComponent);
componentMap.set('image', SimpleImgComponent);

@Directive({
  selector: '[objsHost]'
})
export class ObjsHostDirective implements OnInit {

  private focusSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private ref: ViewContainerRef,
    private objService: ObjsService,
    private render: Renderer2
  ) { }

  ngOnInit() {

  }

  enableDrag(el: HTMLElement, onRectChange) {
    el.onmousedown = (origin: MouseEvent) => {
      origin.preventDefault();
      origin.stopPropagation();
      const { offsetLeft: left, offsetTop: top } = el;
      const { pageX: oPageX, pageY: oPageY } = origin;
      const onmousemove = (ev: MouseEvent) => {
        const { pageX, pageY } = ev;
        const diffX = pageX - oPageX;
        const x = left + diffX;
        el.style.left = `${x}px`;
        const diffY = pageY - oPageY;
        const y = top + diffY;
        el.style.top = `${y}px`;
      }
      const onmouseup = () => {
        window.removeEventListener('mouseup', onmouseup);
        window.removeEventListener('mousemove', onmousemove);
        onRectChange();
      }
      window.addEventListener('mouseup', onmouseup);
      window.addEventListener('mousemove', onmousemove);
    }
  }

  disableDrag(el: HTMLElement) {
    el.onmousedown = null;
  }

  private reset() {
    if (this.focusSub) {
      this.focusSub.unsubscribe();
      this.focusSub = null;
    }
    this.ref.clear();
  }

  @Input() set data(data: ObjNS.Obj) {
    this.reset();

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
      this.render.setStyle(el, 'cursor', 'default');
      el.onclick = () => this.objService.focus.next(data);
      el.onmouseover = () => el.style.border = '1px solid blue';
      el.onmouseleave = () => el.style.border = '';
      this.enableDrag(el, () => {
        const { offsetLeft: x, offsetTop: y, offsetWidth: w, offsetHeight: h } = el;
        const rect = { x, y, w, h };
        this.patch.next({ id: data.id, rect });
      });
    }
  }

  @Output() patch = new EventEmitter<ObjNS.Patch>();

}
