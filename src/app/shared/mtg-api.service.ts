import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { ICard } from "app/card";

@Injectable()
export class MtgApiService {

  constructor(private _http: Http) { }

  getCardInfo(cardName:string):Observable<ICard> {
    var isSplitCard = false;
    var formattedName = cardName;
    if (cardName.indexOf('//') !== -1) {
      formattedName = cardName.replace(' // ', '|');
      isSplitCard = true;
    }
    return this._http.get('https://api.magicthegathering.io/v1/cards?name="'+formattedName+'"')
      .map((response: Response) => {
        return this.parseResponse(response.json(), cardName, isSplitCard);
      })
      //.do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }

  parseResponse(queryJson, cardName:string, isSplitCard:boolean):ICard {
    var card:ICard = {
      name: cardName,
      colorIdentity: [],
      rarity: ''
    };

    var nameArr = cardName.split(' // ');
    var colorIdentities = [];

    queryJson.cards.forEach((eachCard) => {
      if (nameArr.indexOf(eachCard.name) !== -1) {
        if (card.rarity === '')
          card.rarity = eachCard.rarity;
        colorIdentities.push(...eachCard.colorIdentity);
      }
    });

    card.colorIdentity = colorIdentities.filter(function(item, pos, self) {
      return self.indexOf(item) == pos;
    });   

    return card;
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
