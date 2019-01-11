import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ObjNS } from 'src/app/domain/obj';


@Component({
  selector: 'app-simple-text',
  templateUrl: './simple-text.component.html',
  styleUrls: ['./simple-text.component.scss']
})
export class SimpleTextComponent {

  constructor() { }

  @Input() set data(d: ObjNS.Text) {
    console.log('aaaaaaaaaaaaaaaaaaaaaa')
    const el = this.textEl.nativeElement as HTMLElement;
    if (d.style) {
      Object.assign(el.style, d.style);
    }
    if (d.attrs) {
      el.textContent = d.attrs.text;
    }
  };
  @ViewChild('textEl') textEl: ElementRef;

}
