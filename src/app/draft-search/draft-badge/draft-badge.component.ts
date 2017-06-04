import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDraft } from "app/draft";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-draft-badge',
  templateUrl: './draft-badge.component.html',
  styleUrls: ['./draft-badge.component.css']
})
export class DraftBadgeComponent implements OnInit {
  @Input() draft: IDraft;
  @Output() selectedName = new EventEmitter<string>();

  constructor(private _route: ActivatedRoute,
              private _router: Router) { }

  ngOnInit() {
  }

  onButtonClick(name: string) {
    this.selectedName.emit(name.trim());
  }

}
