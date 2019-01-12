import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ObjNS } from 'src/app/domain/obj';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss']
})
export class InputCheckboxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild('inputEl') elRef: ElementRef;

  @Input() set data(d: ObjNS.InputNS.Checkbox) {
    const el = this.elRef.nativeElement as HTMLInputElement;
    el.type = 'checkbox';
  }
}
