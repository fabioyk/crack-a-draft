import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }

  calculatePackPickString(pickNumber:number):string {    
    var pack = Math.floor(pickNumber / 15) + 1;
    var pick = pickNumber % 15 + 1;

    return 'Pack ' + pack + ' Pick ' + pick;
  }
}
