import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';

interface ITextStyle {
  color?: string;
  fontSize?: string;
  fontWeight?: string;
}

@Component({
  selector: 'app-simple-text',
  templateUrl: './simple-text.component.html',
  styleUrls: ['./simple-text.component.scss']
})
export class SimpleTextComponent {

  constructor() { }

  text = '';
  @Input() set model(data: {text: string, style: ITextStyle}) {
    this.text = data.text;
    Object.keys(data.style).forEach(key => {
      this.textEl.nativeElement.style[key] = data.style[key];
    })
  };
  @ViewChild('textEl') textEl: ElementRef;

}
