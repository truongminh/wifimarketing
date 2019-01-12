import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ObjNS } from 'src/app/domain/obj';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild('inputEl') elRef: ElementRef;

  @Input() set data(d: ObjNS.InputNS.Text) {
    const el = this.elRef.nativeElement as HTMLInputElement;
    el.placeholder = d.attrs.placeholder || 'Enter text';
    el.type = 'text';
  }

}
