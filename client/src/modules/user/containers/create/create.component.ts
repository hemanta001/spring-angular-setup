import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  title!: string;

  constructor(private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const path = this.activatedRoute.parent?.routeConfig?.path;
    this.title = 'User';
  }

}
