import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentNS } from 'src/app/domain/content';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  content: ContentNS.Content;
  page: ContentNS.Page;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.content = this.route.snapshot.data.content;
    this.route.params.subscribe(params => {
      this.page = this.content.pages[params.page_id];
    });
  }

}
