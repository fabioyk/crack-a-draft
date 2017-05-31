import { Component, OnInit, Input } from '@angular/core';
import { DbService } from "app/shared/db.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IDraft } from "app/draft";
import { ICrack } from "app/crack";
import { ICard } from "app/card";

@Component({
  selector: 'app-draft-stats',
  templateUrl: './draft-stats.component.html',
  styleUrls: ['./draft-stats.component.css']
})
export class DraftStatsComponent implements OnInit {
  colorNames = ['White', 'Blue', 'Black', 'Red', 'Green'];
  colorArray = ['W', 'U', 'B', 'R', 'G'];
  colorCodeArray = ['#DDDDDD', '#6495ED', '#333333', '#D9534F', '#5CB85C'];

  draftId: string;
  crackId: string;
  draftData: IDraft;
  crackData: ICrack;
  crackAccordions: boolean[];
  errorMessage: string;
  private sub: Subscription;

  // STATS
  pieChartSize:any[] = [250,250];
  pickCounts: number[][];
  archetypeCounts: any[];
  colorCounts: any[];
  crackCount: number;

  topArchetypes: any[];
  topColors: string[];

  colorChartData: any;
  colorChartScheme: any;

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
    });
  }
  
  getDraft(draftId, crackId) {
    console.log('Loaded draft stats. draft id='+draftId);

    this.crackAccordions = [true];
    this._dbService.getDraft(draftId, true)
      .subscribe(draft =>  {
        if (draft.error) {
          this.errorMessage = draft.error;
        } else {
          this.draftData = draft;
          if (crackId) {
            draft.draft.cracks.forEach((eachCrack, i) => {
              if (eachCrack.id === crackId) {
                this.crackData = eachCrack;
                return;
              }              
            });
          }
          this.calculateStats(draft);
        }          
      },
    error => this.errorMessage = <any>error);
  }

  calculateStats(draftData:IDraft) {
    // startup
    this.pickCounts = [];
    for (var i=0; i<8; i++) {
      this.pickCounts[i] = [];
      for (var j=0; j<15; j++) {
        this.pickCounts[i].push(0);
      }
    }
    
    this.archetypeCounts = [];
    this.colorCounts = [['W',0],['U',0],['B',0],['R',0],['G',0]];

    // counting~
    this.crackCount = draftData.draft.cracks.length;

    draftData.draft.picks.forEach((pick, index) => {
      if (index < 8) {
        this.pickCounts[index][pick]++;
      }
    });

    draftData.draft.cracks.forEach((crack) => {
      this.crackAccordions.push(false);
      crack.picks.forEach((pick, index) => {
        this.pickCounts[index][pick]++;
      });
      
      this.addArchetype(this.archetypeCounts, crack.archetype);

      let crackColorArray = crack.archetype.split('');

      crackColorArray.forEach((colorLetter) => {
        this.colorCounts[this.colorArray.indexOf(colorLetter)][1]++;
      });      
    });

    // making results
    for (let i=0; i<this.pickCounts.length; i++) {
      for (let j=0; j<this.pickCounts[i].length; j++) {
        this.pickCounts[i][j] = this.pickCounts[i][j] / (this.crackCount+1) * 100;
      }
    }
    
    // Setting charts up
    this.colorChartData = [];
    this.colorChartScheme = { domain: [] };
    this.colorCounts.forEach((colorCount, i) => {
      if (colorCount[1] > 0) {
        this.colorChartData.push({
          name: this.colorNames[i],
          value: colorCount[1]
        });
        this.colorChartScheme.domain.push(this.colorCodeArray[i]);
      }
    });

    this.topArchetypes = this.getTopArchetypes(this.archetypeCounts, 5);
    console.log(this.topArchetypes);
  }

  getTopArchetypes(archetypeObj:any[], topX) {
    let count = Math.min(archetypeObj.length, topX);
    let result = [];
    archetypeObj.sort((a,b) => {
      return b.count - a.count;
    });
    return archetypeObj.slice(0, count);
  }

  addArchetype(archetypeObj:any[], newArchetype:string):any[] {
    let found = false;
    archetypeObj.forEach((arch) => {
      if (arch.name === newArchetype) {
        arch.count++;
        found = true;
      }
    });
    if (!found) {
      archetypeObj.push({
        name: newArchetype,
        count: 1
      });
    }
    return archetypeObj;
  }

  estimateArchetype(cardpool:ICard[]):string {
    let count:any = [['W',0],['U',0],['B',0],['R',0],['G',0]];    

    cardpool.forEach((card) => {
      if (card.colors) {
        card.colors.forEach((color) => {
          count[this.colorArray.indexOf(color)][1]++;
        })
      }
    });

    count.sort(this.sortColorArray);
    console.log(count);

    let archetype:string = count[0][0];
    let sum:number = count[0][1];
    let index = 1;

    while (sum < 20) {
      archetype += count[index][0];
      sum += count[index][1];
      index++;
    }

    return this.sortArchetypeLetters(archetype);
  }

  getCardArray(draftData:IDraft):ICard[] {
    return draftData.draft.packs.map((pack, packIndex) => {
      let cardName = pack[draftData.draft.picks[packIndex]];      
      return draftData.cards.reduce((prev, curCard) => {
        if (curCard.name === cardName) {
          prev = curCard;
        }
        return prev;
      }, draftData.cards[0]);
    });
  }

  calculatePackPickString(pickNumber:number):string {    
    var pack = Math.floor(pickNumber / 15) + 1;
    var pick = pickNumber % 15 + 1;

    return 'Pack ' + pack + ' Pick ' + pick;
  }

  onClickAccordion(index:number) {
    this.crackAccordions[index] = !this.crackAccordions[index];
  }

  setAllAccordions(value:boolean) {
    for (let i=0; i<this.crackAccordions.length; i++) {
      this.crackAccordions[i] = value;
    }
  }

  sortColorArray(a, b):number {
    return b[1] - a[1];
  }

  sortArchetypeLetters(archetype:string):string {
    let result = '';
    this.colorArray.forEach((colorLetter) => {
      if (archetype.indexOf(colorLetter) !== -1) {
        result += colorLetter;
      }
    });
    return result;
  }
}
