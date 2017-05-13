import { Component, OnInit, Input } from '@angular/core';
import { DbService } from "app/shared/db.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IDraft } from "app/draft";
import { ICrack } from "app/crack";


@Component({
  selector: 'app-draft-stats',
  templateUrl: './draft-stats.component.html',
  styleUrls: ['./draft-stats.component.css']
})
export class DraftStatsComponent implements OnInit {
  draftId: string;
  crackId: string;
  draftData: IDraft;
  crackData: ICrack;
  errorMessage: string;
  private sub: Subscription;

  // STATS
  pickCounts: number[][];
  archetypeCounts: object;
  colorCounts: any[];
  crackCount: number;

  topArchetypes: string[];
  topColors: string[];

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

    this._dbService.getDraft(draftId)
      .subscribe(draft =>  {
        if (draft.error) {
          this.errorMessage = draft.error;
        } else {
          this.draftData = draft;
          if (crackId) {
            draft.draft.cracks.forEach((eachCrack) => {
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
    
    this.archetypeCounts = {};
    this.colorCounts = [['W',0],['U',0],['B',0],['R',0],['G',0]];
    let colorArray = ['W', 'U', 'B', 'R', 'G'];

    // counting~
    this.crackCount = draftData.draft.cracks.length;

    draftData.draft.picks.forEach((pick, index) => {
      if (index < 8) {
        this.pickCounts[index][pick]++;
      }
    });

    draftData.draft.cracks.forEach((crack) => {
      crack.picks.forEach((pick, index) => {
        this.pickCounts[index][pick]++;
      });
      
      if (this.archetypeCounts[crack.archetype]) {
        this.archetypeCounts[crack.archetype]++;
      } else {
        this.archetypeCounts[crack.archetype] = 1;
      }

      let crackColorArray = crack.archetype.split('');

      crackColorArray.forEach((colorLetter) => {
        this.colorCounts[colorArray.indexOf(colorLetter)][1]++;
      });      
    });

    // making results
    for (let i=0; i<this.pickCounts.length; i++) {
      for (let j=0; j<this.pickCounts[i].length; j++) {
        this.pickCounts[i][j] = this.pickCounts[i][j] / (this.crackCount+1) * 100;
      }
    }

    this.colorCounts.sort(function(a, b) {
      return b[1] - a[1];
    });

    console.log(this.colorCounts);

  }

  calculatePackPickString(pickNumber:number):string {    
    var pack = Math.floor(pickNumber / 15) + 1;
    var pick = pickNumber % 15 + 1;

    return 'Pack ' + pack + ' Pick ' + pick;
  }
}
