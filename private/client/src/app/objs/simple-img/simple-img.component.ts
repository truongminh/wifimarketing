import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-simple-img',
  templateUrl: './simple-img.component.html',
  styleUrls: ['./simple-img.component.scss']
})
export class SimpleImgComponent implements OnInit {

  constructor() { }

  @Input() data: any;

  ngOnInit() {
  }

}
