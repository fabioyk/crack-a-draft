import { Component, OnInit, Input } from '@angular/core';
import { IDraft } from "app/draft";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  @Input() draftData:IDraft;

  colorNames = ['White', 'Blue', 'Black', 'Red', 'Green'];
  colorArray = ['W', 'U', 'B', 'R', 'G'];
  colorCodeArray = ['#DDDDDD', '#6495ED', '#333333', '#D9534F', '#5CB85C'];

  pieChartSize:any[] = [250,250];
  archetypeCounts: any[];
  colorCounts: any[];

  topArchetypes: any[];
  topColors: string[];

  colorChartData: any;
  colorChartScheme: any;

  constructor() { }

  ngOnInit() {
    if (this.draftData) {
      this.calculateStats(this.draftData);
    }
  }

  calculateStats(draftData:IDraft) {
    this.archetypeCounts = [];
    this.colorCounts = [['W',0],['U',0],['B',0],['R',0],['G',0]];

    draftData.draft.cracks.forEach((crack) => {      
      this.addArchetype(this.archetypeCounts, crack.archetype);

      let crackColorArray = crack.archetype.split('');

      crackColorArray.forEach((colorLetter) => {
        this.colorCounts[this.colorArray.indexOf(colorLetter)][1]++;
      });      
    });

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

}
