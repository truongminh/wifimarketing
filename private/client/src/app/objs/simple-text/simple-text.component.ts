import { Component, Input, ViewChild, ElementRef } from '@angular/core';

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

  @Input() text: string = '';
  @Input() set style(data: ITextStyle) {
    Object.keys(data).forEach(key => {
      this.textEl.nativeElement.style[key] = data[key];
    })
  };
  @ViewChild('textEl') textEl: ElementRef;

}
