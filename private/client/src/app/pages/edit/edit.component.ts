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

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.content = this.route.snapshot.data.content;
  }

}
