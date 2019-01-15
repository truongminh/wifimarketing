import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ObjNS } from 'src/app/domain/obj';

@Component({
  selector: 'app-simple-img',
  templateUrl: './simple-img.component.html',
  styleUrls: ['./simple-img.component.scss']
})
export class SimpleImgComponent implements OnInit {

  constructor() { }

  @Input() set data(d: ObjNS.Image) {
    const el = this.elRef.nativeElement as HTMLImageElement;
    const attrs = d.attrs || {};
    el.draggable = false;
    el.src = attrs.src || 'https://via.placeholder.com/100';
  }

  ngOnInit() {
  }

  @ViewChild('imgEl') elRef: ElementRef;
}
