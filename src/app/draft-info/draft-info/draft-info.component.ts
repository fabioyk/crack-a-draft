import { Component, OnInit } from '@angular/core';
import { IDraft } from "app/draft";
import { ActivatedRoute, Router } from "@angular/router";
import { DbService } from "app/shared/db.service";
import { Subscription } from "rxjs/Subscription";
import { ICrack } from "app/crack";
import { IFormat } from "app/format";

@Component({
  selector: 'app-draft-info',
  templateUrl: './draft-info.component.html',
  styleUrls: ['./draft-info.component.css']
})
export class DraftInfoComponent implements OnInit {
  draftId: string;
  crackId: string;
  draftData: IDraft;
  crackData: ICrack;
  errorMessage: string;
  private sub: Subscription;

  formatName:string;

  isDraftPicksStartingTab: boolean;
  
  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _dbService: DbService) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(
        params => {
            let id = params['draftId'];
            let crackId = params['crackId'];
            // TODO: validate params
            this.draftId = id;
            this.crackId = crackId;
            this.getDraft(id, crackId);

            if (this.crackId) {
              this.isDraftPicksStartingTab = false;              
            } else {
              this.isDraftPicksStartingTab = true;
            }
    });
  }

  getDraft(draftId, crackId) {
    this._dbService.getDraft(draftId, true)
      .subscribe(draft =>  {
        if (draft.error) {
          this.errorMessage = draft.error;
        } else {
          this.draftData = draft;
          if (this.crackId) {
            this._dbService.getFormats()
              .subscribe(formats => {
                if (formats[0].error) {
                  this.errorMessage = formats[0].error;
                } else {
                  formats.forEach((format) => {
                    if (format.mtgoName === this.draftData.format.mtgoName) {
                      this.formatName = format.mtgoName + ',' + format.drafts;
                    }
                  })
                }
              });
          }
          if (crackId && draft.draft.cracks.length > 0) {
            draft.draft.cracks.forEach((eachCrack, i) => {
              if (eachCrack.id === crackId) {
                this.crackData = eachCrack;
                return;
              }              
            });
          }          
        }          
      },
    error => this.errorMessage = <any>error);
  }

  gotoAnotherDraft() {
    this._dbService.getDraftByFormat(this.formatName)
      .subscribe(draft =>  {
        if (draft.error) {
          this.errorMessage = draft.error;
        } else {          
          this._router.navigate(['/crack', draft.draft._id]);
        }          
      },
    error => this.errorMessage = <any>error);
  }

}
