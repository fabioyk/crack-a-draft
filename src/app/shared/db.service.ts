import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IDraft } from "app/draft";
import { IFormat } from "app/format";
import { ICard } from "app/card";
import { environment } from "environments/environment";

@Injectable()
export class DbService {
  private _apiUrl;

  constructor(private _http: Http) {
    if (environment.production) {
      this._apiUrl = 'https://crack-a-draft.herokuapp.com/api/';
    } else {
      this._apiUrl = 'https://crack-a-draft.glitch.me/api/'
    }
   }

  getCardInfo(cardName:string):Observable<ICard> {
    let queryUrl = this._apiUrl + 'card?name=' + cardName;
    return this._http.get(queryUrl)
      .map((response: Response) => <ICard> response.json())
      .catch(this.handleError);
  }

  getCardsInfo(cardNameArray:string[]):Observable<ICard[]> {

    let queryUrl = this._apiUrl + 'card?array=' + cardNameArray.join('|*|*|');
    return this._http.get(queryUrl)
      .map((response: Response) => <ICard[]> response.json())
      .catch(this.handleError);
  }

  getDraft(draftId:string, isCardDataEmbed:boolean):Observable<IDraft> {
    let queryUrl = this._apiUrl + 'draft?id=' + draftId;
    if (isCardDataEmbed) {
      queryUrl += '&embed=true';
    }
    return this._http.get(queryUrl)
      .map((response: Response) => <IDraft> response.json())
      .catch(this.handleError);
  }

  getDraftsById(draftIds:string[]):Observable<IDraft[]> {
    let queryUrl = this._apiUrl + 'draft?ids=' + draftIds;
    return this._http.get(queryUrl)
      .map((response: Response) => <IDraft[]> response.json())
      .catch(this.handleError);
  }

  getDrafts(drafter:string, pageSize: number, pageNumber: number):Observable<IDraft[]> {
    let queryUrl = this._apiUrl + 'draft?pageSize=' + pageSize +'&pageNumber=' + pageNumber;
    if (drafter) {
      queryUrl += '&username=' + drafter;
    }
    return this._http.get(queryUrl)
      .map((response: Response) => <IDraft[]> response.json())
      .catch(this.handleError);
  }

  getDraftsCount(drafter:string):Observable<any> {
    let queryUrl = this._apiUrl + 'draft/count';
    if (drafter) {
      queryUrl += '?username=' + drafter;
    }
    return this._http.get(queryUrl)
      .map((response: Response) => <any> response.json())
      .catch(this.handleError);
  }

  getDraftByFormat(format:string):Observable<IDraft> {
    return this._http.get(this._apiUrl + 'draft?format=' + format)
      .map((response: Response) => <IDraft> response.json())
      .catch(this.handleError);
  }

  getFormats():Observable<IFormat[]> {
    return this._http.get(this._apiUrl + 'format')
      .map((response: Response) => <IFormat> response.json())
      .catch(this.handleError);
  }

  uploadCrack(draftId:string, picks:number[], archetype:string):Observable<string> {
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers });
    return this._http.post(this._apiUrl + 'crack',
      {
        draftId: draftId,
        picks: picks,
        archetype: archetype
      }, options)
      .map((response: Response) => {
        var result = response.json();
        if (result.error) {
          return null;
        } else {
          return result.id;
        }
      })
      .catch(this.handleError);
  }



  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
