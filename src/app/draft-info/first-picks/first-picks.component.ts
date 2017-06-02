import { Component, OnInit, Input } from '@angular/core';
import { IDraft } from "app/draft";

@Component({
  selector: 'app-first-picks',
  templateUrl: './first-picks.component.html',
  styleUrls: ['./first-picks.component.css']
})
export class FirstPicksComponent implements OnInit {
  @Input() draftData:IDraft;

  crackAccordions: boolean[];

  constructor() { }

  ngOnInit() {
    if (this.draftData) {
      this.crackAccordions = Array(this.draftData.draft.cracks.length + 1);
      this.crackAccordions.fill(false);
      this.crackAccordions[0] = true;
    }    
  }

  onClickAccordion(index:number) {
    this.crackAccordions[index] = !this.crackAccordions[index];
  }

  setAllAccordions(value:boolean) {
    for (let i=0; i<this.crackAccordions.length; i++) {
      this.crackAccordions[i] = value;
    }
  }

}
