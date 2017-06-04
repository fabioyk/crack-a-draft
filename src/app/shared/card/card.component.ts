import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() cardName: string;
  @Input() picked: boolean;
  @Input() pile: boolean;
  @Input() stats: number;
  @Input() stacked: boolean;
  @Input() clickable: boolean;
  @Input() cutout: boolean;
  @Input() hoverCard:boolean;
  @Input() altTitle: string;
  @Input() draftPicks:boolean;
  cardImageUrl: string;
  pickrate:string;
  @Input() index: number;
  @Output() cardClicked: EventEmitter<string> =
    new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    if (this.cardName) {
      this.cardImageUrl = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=' 
        + this.cardName;
    }
    if (this.stats) {
      this.pickrate = this.stats.toFixed(2);
    }
    if (!this.altTitle) {
      this.altTitle = this.cardName;
    }
  }

  ngOnChanges() {
    if (this.cardName) {
      this.cardImageUrl = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=' 
        + this.cardName;
    }
  }

  onClick():void {
    if (this.index >= 0)
      this.cardClicked.emit(this.index.toString());
  }

}
