import { Component, OnInit, Input } from '@angular/core';
import { DbService } from "app/shared/db.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IDraft } from "app/draft";

@Component({
  selector: 'app-draft-viewer',
  templateUrl: './draft-viewer.component.html',
  styleUrls: ['./draft-viewer.component.css']
})
export class DraftViewerComponent implements OnInit {
  draftId: string;
  draftData: IDraft;
  errorMessage: string;

  private sub: Subscription;
  
  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _dbService: DbService) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(
        params => {
            let id = params['draftId'];
            this.getDraft(id);
    });
  }

  getDraft(draftId:string) {
    console.log('Loaded draft viewer. draft id='+draftId);  

    if(draftId) {
      this.draftId = draftId;
      this._dbService.getDraft(draftId, true)
        .subscribe(draft =>  {
          if (draft.error) {
            this.errorMessage = draft.error;
          } else {
            this.draftData = draft;
          }          
        },
      error => this.errorMessage = <any>error);
    }
  }

  calculatePackPickString(pickNumber:number):string {    
    var pack = Math.floor(pickNumber / 15) + 1;
    var pick = pickNumber % 15 + 1;

    return 'Pack ' + pack + ' Pick ' + pick;
  }

}
