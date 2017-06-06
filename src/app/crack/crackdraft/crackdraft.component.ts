import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DbService } from "app/shared/db.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IDraft } from "app/draft";
import { ICard } from "app/card";
import { WindowRefService } from "app/shared/window-ref.service";

@Component({
  selector: 'app-crackdraft',
  templateUrl: './crackdraft.component.html',
  styleUrls: ['./crackdraft.component.css']
})

export class CrackdraftComponent implements OnInit {
  @ViewChild('pickText') pickTextElement: ElementRef;
  private _window: Window;

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
              private _windowRef: WindowRefService) {
                this._window = _windowRef.nativeWindow;
               }

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
    this._window.scrollTo(0, this.pickTextElement.nativeElement.offsetTop - 15);
    this.currentPick++;

    if (this.currentPick > 8) {
      this.currentState = 2;   
      this._dbService.getCardsInfo(this.myPickedCardNames)
      .subscribe(cards => {
        this.myPickedCards = cards;
        this.updateColorCount(this.myPickedCardNames, this.myPickedCards);
        this.setColorCheckboxesDefault();        
      });
    }
  }

  updateColorCount(cardNames:string[], cardArray:ICard[]):void {
    cardNames.forEach((cardName) => {
      cardArray.forEach((card) => {
        if (card.name === cardName && card.colorIdentity)
          card.colorIdentity.forEach((color) => this.colorCount[color]++);
      })
    });
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
