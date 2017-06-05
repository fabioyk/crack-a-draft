import { Component, OnInit, Input, Inject } from '@angular/core';
import { DbService } from "app/shared/db.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IDraft } from "app/draft";
import { ICard } from "app/card";
import { SimplePageScrollService } from "ng2-simple-page-scroll/ng2-simple-page-scroll";
import { DOCUMENT } from "@angular/platform-browser/";

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
  myPickedCardNames: string[];
  myPickedCards: ICard[];
  currentPick: number;
  archetype: String;
  colorCount: object;
  public colorCheckboxes: boolean[];
  isSubmitting: boolean;

  colorNames = ['White', 'Blue', 'Black', 'Red', 'Green'];
  classNames = ['btn-default', 'btn-info', 'btn-black', 'btn-danger', 'btn-success'];
  colors = ['W', 'U', 'B', 'R', 'G'];

  currentState: number;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _dbService: DbService,
              private simplePageScrollService: SimplePageScrollService,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(
        params => {
            let id = params['draftId'];
            this.getDraft(id);
    });
    
    this.currentState = 0;
    this.isSubmitting = false;

    this.colorCheckboxes = [false, false, false, false, false];
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
    this.myPickedCardNames = [];
    this.currentPick = 1;
    this.colorCount = { W: 0, U:0, B:0, R:0, G:0};

    this.currentState = 1;
  }

  onCardClicked(cardIndex:number, cardName:string):void {
    this.myPickedIndex.push(cardIndex);
    this.myPickedCardNames.push(cardName);
    this.simplePageScrollService.scrollToElement('#pickMsg', -15);
    this.currentPick++;

    if (this.currentPick > 8) {
      this.currentState = 2;   
      this._dbService.getCardsInfo(this.myPickedCardNames)
      .subscribe(cards => {
        this.myPickedCards = cards;
        this.updateColorCount(this.myPickedCards);
        this.setColorCheckboxesDefault();        
      });   
    }    
  }

  updateColorCount(cardArray:ICard[]):void {
    cardArray.forEach((card) => {
      if (card.colorIdentity)
        card.colorIdentity.forEach((color) => this.colorCount[color]++);
    })
    
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
    this.isSubmitting = true;
    var archetype = '';
    for (var i=0; i<5; i++) {
      if (this.colorCheckboxes[i]) {
        archetype += this.colors[i];
      }
    }
    this._dbService.uploadCrack(this.draftId, this.myPickedIndex, archetype)
      .subscribe(crackId => {        
        if (crackId) {
          this._router.navigate(['/draft', this.draftId, crackId]);
        }
        this.isSubmitting = false;
      })
  }
}
