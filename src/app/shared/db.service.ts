import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/observable/throw';
import { IDraft } from "app/draft";
import { IFormat } from "app/format";
import { ICard } from "app/card";
import { environment } from "environments/environment";

@Injectable()
export class DbService {
  private _apiUrl;

  private _formats: Observable<IFormat[]>
  private _featuredDrafts: Observable<IDraft[]>
  private _draftCount: Observable<any>;
  private _lastUploadedDrafts:Observable<IDraft[]>;

  private _cacheTime = 1000 * 60 * 5;

  private _featuredDraftsList = [
      '5931fdc0dea92400118e0675', '5931fe9c8734e10011abb6b5', 
      '5931fde3dea92400118e0678', '5931fddddea92400118e0677', '5931fdeddea92400118e067a',
      '5931fea28734e10011abb6b6', '5931fe968734e10011abb6b4', '5931fe8e8734e10011abb6b3'
    ];

  constructor(private _http: Http) {
    if (environment.production) {
      //this._apiUrl = 'https://crack-a-draft.herokuapp.com/api/';
      this._apiUrl = 'https://crack-a-draft.glitch.me/api/'      
    } else {
      this._apiUrl = 'https://crack-a-draft.glitch.me/api/'
    }
  }

  getFeaturedDrafts():Observable<IDraft[]> {
    if (!this._featuredDrafts) {
      this._featuredDrafts = this.getDraftsById(this._featuredDraftsList)
        .publishReplay(1, this._cacheTime)
        .refCount()
        .take(1);
    }
    return this._featuredDrafts;
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
    if (!drafter && pageNumber === 0) {
      if (!this._lastUploadedDrafts) {
        this._lastUploadedDrafts = this._http.get(queryUrl)
          .map((response: Response) => <IDraft[]> response.json())
          .catch(this.handleError)
          .publishReplay(1, this._cacheTime)
          .refCount()
          .take(1);
      }
      return this._lastUploadedDrafts;
    } else {
      this._lastUploadedDrafts = null;
      return this._http.get(queryUrl)
        .map((response: Response) => <IDraft[]> response.json())
        .catch(this.handleError);
    }
    
  }

  getDraftsCount(drafter:string):Observable<any> {
    let queryUrl = this._apiUrl + 'draft/count';
    if (drafter) {
      this._draftCount = null;
      queryUrl += '?username=' + drafter;

      return this._http.get(queryUrl)
        .map((response: Response) => <any> response.json())
        .catch(this.handleError);
    } else {
      if (!this._draftCount) {
        this._draftCount = this._http.get(queryUrl)
          .map((response: Response) => <any> response.json())
          .catch(this.handleError)
          .publishReplay(1, this._cacheTime)
          .refCount()
          .take(1);
      }
      return this._draftCount;
    }    
  }

  getDraftByFormat(format:string):Observable<IDraft> {
    return this._http.get(this._apiUrl + 'draft?format=' + format)
      .map((response: Response) => <IDraft> response.json())
      .catch(this.handleError);
  }

  getFormats():Observable<IFormat[]> {
    if (!this._formats) {
      this._formats = this._http.get(this._apiUrl + 'format')
        .map((response: Response) => <IFormat> response.json())
        .catch(this.handleError)
        .publishReplay(1, this._cacheTime)
        .refCount()
        .take(1);
    }
    return this._formats;
  }

  uploadCrack(draftId:string, picks:number[], archetype:string):Observable<string> {
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options= new RequestOptions({ headers: headers });
    if (this._featuredDraftsList.indexOf(draftId) !== -1) {
      this._featuredDrafts = null;
    }    
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

  clearCacheForDraftUpload() {
    this._formats = null;
    this._lastUploadedDrafts = null;
    this._draftCount = null;
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
