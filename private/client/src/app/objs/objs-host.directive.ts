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

  @Input() set objID(value: string) {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
      this.pageSubscription = null;
    }
    this.pageSubscription = this.objService.page$.subscribe(page => {
      if (this.objSubscription) {
        this.objSubscription.unsubscribe();
        this.objSubscription = null;
      }
      this.registerOBJ(page.objs[value])
    })

  };

  @Output() patch = new EventEmitter<ObjNS.Patch>();

  private pageSubscription: Subscription;
  private objSubscription: Subscription;

  ngOnInit() {

  }

  enableDrag(el: HTMLElement, onRectChange) {
    el.onmousedown = (origin: MouseEvent) => {
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

  private registerOBJ(data: ObjNS.Obj) {
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
      this.objSubscription = this.objService.focus$.subscribe(obj => {
        if (obj && obj.id === data.id) el.style.border = '1px solid #f00';
        if (!obj || obj.id !== data.id) el.style.border = '';
      })
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
          const newContent = this.objService.content$.value;
          newContent.pages[this.objService.selectedPage$.value].objs[data.id].rect = rect;
          this.objService.content$.next(newContent);
        }
        window.addEventListener('mouseup', onmouseup);
        window.addEventListener('mousemove', onmousemove);
      };
      el.onmouseover = () => {
        if (!this.objService.focus$.value || this.objService.focus$.value.id !== data.id)
          el.style.border = '1px solid blue';
      };
      el.onmouseleave = () => {
        if (!this.objService.focus$.value || this.objService.focus$.value.id !== data.id)
          el.style.border = '';
      }
    }
  }
}
