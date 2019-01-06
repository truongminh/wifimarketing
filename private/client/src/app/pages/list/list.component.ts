import { Component, OnInit, Inject } from '@angular/core';
import { ContentNS } from '../../domain/content';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  data: ContentNS.Content[] = [];

  constructor(
    private contentRepo: ContentNS.Repo
  ) { }

  ngOnInit() {
    this.contentRepo.List().then(data => this.data = data);
  }

  add(el: HTMLInputElement) {
    const contentName = el.value;
    console.log('add', contentName);
    this.contentRepo.Create(contentName);
    el.value = '';
  }

}
