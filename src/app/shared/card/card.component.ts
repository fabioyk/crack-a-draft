import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() cardName: string;
  @Input() picked: boolean;
  cardImageUrl: string;
  @Input() index: number;
  @Output() cardClicked: EventEmitter<string> =
    new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    if (this.cardName) {
      this.cardImageUrl = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&name=' 
        + this.cardName;
    }    
  }

  onClick():void {
    console.log('clicked',this.index);
    this.cardClicked.emit(this.index.toString());
  }

}
