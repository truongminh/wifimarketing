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

  private pageSubscription: Subscription;
  private objSubscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private ref: ViewContainerRef,
    private objService: ObjsService,
    private render: Renderer2
  ) { }

  @Input() set objID(id: string) {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
      this.pageSubscription = null;
    }
    this.pageSubscription = this.objService.page$.subscribe(page => {
      if (this.objSubscription) {
        this.objSubscription.unsubscribe();
        this.objSubscription = null;
      }
      const obj = page.objs[id];
      if (obj) {
        this.registerOBJ(obj);
      }
    });
  };

  ngOnInit() {

  }

  enableDrag(el: HTMLElement, data: ObjNS.Obj) {
    el.onmousedown = (origin: MouseEvent) => {
      this.objService.focus$.next(data);
      // origin.preventDefault();
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
        const { offsetLeft: x, offsetTop: y, clientWidth: w, clientHeight: h } = el;
        const rect = { x, y, w, h };
        this.objService.Patch({ id: data.id, rect });
      }
      window.addEventListener('mouseup', onmouseup);
      window.addEventListener('mousemove', onmousemove);
    };
  }

  disableDrag(el: HTMLElement) {
    el.onmousedown = null;
  }

  private reset() {
    this.ref.clear();
  }

  private setStyle(el: HTMLElement, data: ObjNS.Obj) {
    const rect = data.rect || {};
    const { x, y, w, h } = rect;
    this.render.setStyle(el, 'position', 'absolute');
    this.render.setStyle(el, 'top', `${y || 0}px`);
    this.render.setStyle(el, 'left', `${x || 0}px`);
    this.render.setStyle(el, 'width', `${w || 20}px`);
    this.render.setStyle(el, 'height', `${h || 20}px`);
    this.render.setStyle(el, 'cursor', 'default');
  }

  private registerOBJ(data: ObjNS.Obj) {
    this.reset();
    const componentType = componentMap.get(data.type);
    if (!componentType) {
      return;
    }
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    let componentRef = this.ref.createComponent(componentFactory, 0);
    componentRef.instance.data = data;
    const elRef = componentRef.injector.get(ElementRef) as ElementRef;
    const el = elRef.nativeElement as HTMLElement;
    this.setStyle(el, data);
    this.enableDrag(el, data);
    const isFocus = () => this.objService.IsFocus(data.id);
    this.objSubscription = this.objService.focus$.subscribe(obj => {
      if (obj && obj.id === data.id) el.style.border = '1px solid #f00';
      if (!obj || obj.id !== data.id) el.style.border = '';
    });
    el.onmouseover = () => {
      if (!isFocus()) {
        el.style.border = '1px solid blue';
      }
    };
    el.onmouseleave = () => {
      if (!isFocus()) {
        el.style.border = '';
      }
    }
  }
}
