import { Directive, ViewContainerRef, Input, ComponentFactoryResolver } from '@angular/core';
import { SimpleTextComponent } from './simple-text/simple-text.component';
import { SimpleImgComponent } from './simple-img/simple-img.component';
import { ObjNS } from '../domain/obj';

@Directive({
  selector: '[objsHost]'
})
export class ObjsHostDirective {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private ref: ViewContainerRef,
    public viewContainerRef: ViewContainerRef,
  ) { }

  @Input() set data(data: ObjNS.Text | ObjNS.Image | ObjNS.Input) {
    if (data) {
      switch (data.type) {
        case 'text': {
          let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SimpleTextComponent);
          let componentRef = this.ref.createComponent(componentFactory);
          componentRef.instance.data = data as ObjNS.Text;
          break;
        }
        case 'image': {
          let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SimpleImgComponent);
          let componentRef = this.ref.createComponent(componentFactory);
          componentRef.instance.data = data as ObjNS.Image;
          break;
        }
        case 'input': {
          console.log('aaaaaaaaaaaa');
          // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SimpleTextComponent);
          // let componentRef = this.ref.createComponent(componentFactory);
          // componentRef.instance.data = data as ObjNS.Input;
          break;
        }
        default:
          break;
      }
    }
  }

}
