import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IDraft } from "app/draft";



@Injectable()
export class DbService {
  private _apiUrl = 'https://crack-a-draft.glitch.me/api/';

  constructor(private _http: Http) { }

  getDraft(draftId:string):Observable<IDraft> {
    return this._http.get(this._apiUrl + 'draft?id=' + draftId)
      .map((response: Response) => <IDraft> response.json())
      //.do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
