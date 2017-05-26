import { Component, OnInit, Input } from '@angular/core';
import { DbService } from "app/shared/db.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IDraft } from "app/draft";
import { ICard } from "app/card";

@Component({
  selector: 'app-crackdraft',
  templateUrl: './crackdraft.component.html',
  styleUrls: ['./crackdraft.component.css']
})

export class CrackdraftComponent implements OnInit {
  draftId: string;
  draftData: IDraft;
  errorMessage: string;
  private sub: Subscription;

  myPickedIndex: number[];
  myPickedCards: ICard[];
  currentPick: number;
  archetype: String;
  colorCount: object;
  colorCheckboxes: boolean[];

  colorNames = ['White', 'Blue', 'Black', 'Red', 'Green'];
  colors = ['W', 'U', 'B', 'R', 'G'];

  currentState: number;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _dbService: DbService) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(
        params => {
            let id = params['draftId'];
            this.getDraft(id);
    });
    
    this.currentState = 0;

    this.colorCheckboxes = [];
  }

  getDraft(draftId:string) {
    if(draftId) {
      this.draftId = draftId;
      this._dbService.getDraft(draftId, false)
        .subscribe(draft => {
          this.draftData = draft;
          this.startupCrackDraft();
        },
                   error => this.errorMessage = <any>error);
    }
  }

  startupCrackDraft() {
    this.myPickedIndex = [];
    this.myPickedCards = [];
    this.currentPick = 1;
    this.colorCount = { W: 0, U:0, B:0, R:0, G:0};

    this.currentState = 1;
  }

  onCardClicked(cardIndex:number, cardName:string):void {
    //console.log(cardIndex);
    this.myPickedIndex.push(cardIndex);

    this.currentPick++;

    if (this.currentPick > 8) {
      this.currentState = 2;      
    }

    this._dbService.getCardInfo(cardName)
      .subscribe(cardData => {
        this.myPickedCards.push(cardData[0]);
        this.updateColorCount(cardData[0]);
        if (this.currentState === 2) {
          this.setColorCheckboxesDefault();
          console.log(this.myPickedIndex);
          console.log(this.myPickedCards);
          console.log(this.colorCount);
        }
      });
  }

  updateColorCount(newCard:ICard):void {
    newCard.colorIdentity.forEach((color) => this.colorCount[color]++);
  }

  setColorCheckboxesDefault():void {
    for (var i=0; i<5; i++) {
      if (this.colorCount[this.colors[i]] > 2) {
        this.colorCheckboxes[i] = true;
      } else {
        this.colorCheckboxes[i] = false;
      }
    }
  }

  onSubmitCrackDraft():void {
    var archetype = '';
    for (var i=0; i<5; i++) {
      if (this.colorCheckboxes[i]) {
        archetype += this.colors[i];
      }
    }
    this._dbService.uploadCrack(this.draftId, this.myPickedIndex, archetype)
      .subscribe(crackId => {
        if (crackId) {
          this._router.navigate(['/stats', this.draftId, crackId]);
        }
      })
  }
}
