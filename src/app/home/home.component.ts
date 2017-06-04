import { Component, OnInit } from '@angular/core';
import { DbService } from "app/shared/db.service";
import { IDraft } from "app/draft";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAccordionOpen:boolean;
  draftData: IDraft[];
  private sub: Subscription;

  featuredDrafts:string[];

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.isAccordionOpen = false;
    this.draftData = [];
    this.featuredDrafts = [
      '5931feba8734e10011abb6ba', '5931feb38734e10011abb6b9', '5931fead8734e10011abb6b8', '5931fea88734e10011abb6b7',
      '5931fea28734e10011abb6b6', '5931fe9c8734e10011abb6b5', '5931fe968734e10011abb6b4', '5931fe8e8734e10011abb6b3',
      '5931fdf2dea92400118e067b', '5931fdeddea92400118e067a', '5931fde8dea92400118e0679', '5931fde3dea92400118e0678',
      '5931fddddea92400118e0677', '5931fdd8dea92400118e0676', '5931fdc0dea92400118e0675', '5931fd3bdea92400118e0674'
    ];

    if (this.featuredDrafts.length > 0) {
      this.featuredDrafts.forEach((draftId) => {
        this._dbService.getDraft(draftId, false)
          .subscribe(draft => {
            if (!draft.error) {
              this.draftData.push(draft);
            }            
          });
      });
      
    }
  }

  onClickAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
}
