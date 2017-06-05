import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  calculatePackPickString(pickNumber:number):string {    
    var pack = Math.floor(pickNumber / 15) + 1;
    var pick = pickNumber % 15 + 1;

    return 'Pack ' + pack + ' Pick ' + pick;
  }

  formatDate(date:Date) {
    let day = date.getDate() + 1;
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let stringDay = '';
    if (day < 10) {
      stringDay = '0' + day;
    } else {
      stringDay = day.toString();
    }

    let stringMonth = '';
    if (month < 10) {
      stringMonth = '0' + month;
    } else {
      stringMonth = month.toString();
    }

    return stringMonth + '/' + stringDay + '/' + year;
  }
}
