import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from "app/shared/utils.service";
import { IDraft } from "app/draft";
import { ICrack } from "app/crack";

@Component({
  selector: 'app-pick-rate',
  templateUrl: './pick-rate.component.html',
  styleUrls: ['./pick-rate.component.css']
})
export class PickRateComponent implements OnInit {
  @Input() draftData: IDraft;
  @Input() crackData: ICrack;

  pickCounts: number[][];

  constructor(private _utilsService: UtilsService) { }

  ngOnInit() {
    if (this.draftData && this.draftData.draft.cracks.length > 0) {
      this.pickCounts = this.calculateStats(this.draftData);
    }
  }

  calculateStats(draftData:IDraft) {
    const crackCount = draftData.draft.cracks.length;

    // startup
    let pickCounts = <number[][]>Array(8);
    for (let i=0; i<8; i++) {
      pickCounts[i] = Array(15).fill(0);      
    }
    
    // counting~
    draftData.draft.picks.forEach((pick, index) => {
      if (index < 8) {
        pickCounts[index][pick]++;
      }
    });

    draftData.draft.cracks.forEach((crack) => {
      crack.picks.forEach((pick, index) => {
        pickCounts[index][pick]++;
      });
    });

    // making results
    for (let i=0; i<pickCounts.length; i++) {
      for (let j=0; j<pickCounts[i].length; j++) {
        pickCounts[i][j] = pickCounts[i][j] / (crackCount+1) * 100;
      }
    }    

    return pickCounts;
  }

  calculatePackPickString(index:number):string {
    return this._utilsService.calculatePackPickString(index);
  }
}
