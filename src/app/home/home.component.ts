import { Component, OnInit } from '@angular/core';
import { IDraft } from "app/draft";
import { Subscription } from "rxjs/Subscription";
import { DbService } from "app/shared/db.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAccordionOpen:boolean;
  draftData: IDraft[];

  featuredDrafts:string[];

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.isAccordionOpen = false;
    this.draftData = [];    

    this._dbService.getFeaturedDrafts()
      .subscribe(drafts => {
        if (!drafts[0].error) {
          this.draftData = drafts;
        }
      });   
  }

  onClickAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
}
