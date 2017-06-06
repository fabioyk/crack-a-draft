import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ICard } from "app/card";
import { IDraft } from "app/draft";
import { Subscription } from "rxjs/Subscription";
import { Router, ActivatedRoute } from "@angular/router/";
import { UtilsService } from "app/shared/utils.service";

@Component({
  selector: 'app-draft-pool',
  templateUrl: './draft-pool.component.html',
  styleUrls: ['./draft-pool.component.css']
})
export class DraftPoolComponent implements OnInit {
  @Input() draftData: IDraft;
  cardPool: ICard[];
  cardPoolSwitches: boolean[];

  cardPools: ICard[][];
  cardPoolsColumnNames: string[][];
  cardPoolsColumns: ICard[][][];
  
  sortBy: string;
  isColumnView: boolean;
  hoveredCard: string;

  isLeft:boolean;
  private sub:Subscription;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _location: Location,
              private _utils:UtilsService) { }

  ngOnInit() {
    this.isLeft = false;
    this.isColumnView = false;    

    this.sub = this._route.queryParams.subscribe(
      params => {
        if (this.draftData) {
          this.createCardPoolArray(this.draftData, params['d']);
          this.sortCardPoolArray('cmc');
        }                   
    });
  }

  onMouseOver(card:ICard) {
    this.hoveredCard = card.name;
  }

  onHoverCardMouseOver() {
    this.isLeft = !this.isLeft;
  }

   sortCardPoolArray(sortBy:string) {
    this.cardPoolsColumnNames = [[],[]];    
    this.cardPoolsColumns = [[],[]];

    this.sortBy = sortBy;
    const sortingObject = {
      name: {
        fullFn: this.sortByName,
        fn: this.sortByName
      },
      cmc: {
        fullFn: (a,b) => this.usePoolSorters(
            [this.sortByCmc, this.sortByColor, 
            this.sortByType, this.sortByName], 
            a, b),
        fn: this.sortByCmc
      },
      color: {
        fullFn: (a,b) => this.usePoolSorters(
            [this.sortByColor, this.sortByType, 
            this.sortByCmc, this.sortByName], 
            a, b),
        fn: this.sortByColor
      },
      type: {
        fullFn: (a,b) => this.usePoolSorters(
          [this.sortByType, this.sortByColor, 
          this.sortByCmc, this.sortByName],
          a, b),
        fn: this.sortByType
      }
    }

    this.cardPools.forEach((cardPool, i) => {
      cardPool.sort(sortingObject[sortBy].fullFn);
      this.separateColumns(cardPool, sortingObject[sortBy].fn, sortBy, this.cardPoolsColumns[i], this.cardPoolsColumnNames[i]);
    });
  }

  separateColumns(sortedCardPool:ICard[], mainSorter:Function, attribute:string, cardPoolColumnsArray:ICard[][], cardPoolColumnNamesArray:string[]) {    
    while (cardPoolColumnNamesArray.length > 1) {
      cardPoolColumnNamesArray.pop();
    }
    while (cardPoolColumnsArray.length > 1) {
      cardPoolColumnsArray.pop();
    }
    if (sortedCardPool.length === 0) {
      return;
    }
    cardPoolColumnsArray.push([sortedCardPool[0]]);
    let currentColumn = 0;
    sortedCardPool.forEach((eachCard, index) => {
      if (index > 0) {
        let diff:number = mainSorter(sortedCardPool[index-1], sortedCardPool[index]);
        if (diff !== 0) {
          cardPoolColumnNamesArray.push(this.getColumnName(cardPoolColumnsArray[currentColumn], attribute));
          cardPoolColumnsArray.push([]);
          currentColumn++;
        }
        cardPoolColumnsArray[currentColumn].push(sortedCardPool[index]);
      }
    });
    cardPoolColumnNamesArray.push(this.getColumnName(cardPoolColumnsArray[currentColumn], attribute));
  }

  getColumnName(similarCards:ICard[], attribute:string):string {    
    if (similarCards.length === 0) {
      return '';
    }
    switch(attribute) {
      case 'cmc':
        if (!similarCards[0].cmc) {
          return '0';
        }
        return similarCards[0].cmc.toString();
      case 'rarity':
        return similarCards[0].rarity;
      case 'color':        
        if (similarCards[0].types.indexOf('Land') !== -1) {
          return 'Land';
        }
        if (similarCards[0].colors) {
          if (similarCards[0].colors.length > 1) {
            return 'Multicolor';
          } else {
            switch (similarCards[0].colors[0]) {
              case 'W':
                return 'White';
              case 'U':
                return 'Blue';
              case 'B':
                return 'Black';
              case 'R':
                return 'Red';
              case 'G':
                return 'Green';
              default:
                return 'Unknown';
            }
          }
        } else {
          return 'Colorless';
        }     
      case 'type':
        const typeRanking = ['Planeswalker', 'Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Land'];
        let type = typeRanking.reduce((chosen, currentType) => {
          if (!chosen) {
            similarCards.forEach((eachCard) => {
              if (eachCard.types.indexOf(currentType) !== -1) {
                chosen = currentType;
              }
            })
          }
          return chosen;          
        }, null);
        if (!type) type = 'Unknown';
        return type;
      case 'name':
        return '';
    }
    return '';

  }

  usePoolSorters(sorters:Function[], a:ICard, b:ICard):number {
    return sorters.reduce((curSort, curSorter) => {
      if (curSort === 0) {
        return curSorter(a, b);
      } else {
        return curSort;
      }
    }, 0);
  }

  sortByName(itemA:ICard, itemB:ICard):number {
    if (itemA.name < itemB.name) {
      return -1;
    }
    if (itemA.name > itemB.name) {
      return 1;
    }
    return 0;
  }

  sortByCmc(itemA:ICard, itemB:ICard):number {
    return itemA.cmc - itemB.cmc;
  }

  sortByColor(itemA:ICard, itemB:ICard):number {    
    const colors = ['W', 'U', 'B', 'R', 'G'];
    if (itemA.types.indexOf('Land') !== -1 && itemB.types.indexOf('Land') === -1)
      return 1;
    if (itemA.types.indexOf('Land') === -1 && itemB.types.indexOf('Land') !== -1)
      return -1;
    if (itemA.types.indexOf('Land') !== -1 && itemB.types.indexOf('Land') !== -1)
      return 0;
    if (!itemA.colors && itemB.colors)
      return 1;
    if (itemA.colors && !itemB.colors)
      return -1;
    if (!itemA.colors && !itemB.colors)
      return 0;
    if (itemA.colors.length > 1 && itemB.colors.length === 1)
      return 1;
    if (itemA.colors.length === 1 && itemB.colors.length > 1)
      return -1;
    if (itemA.colors.length > 1 && itemB.colors.length > 1)
      return 0;
    return colors.indexOf(itemA.colors[0]) - colors.indexOf(itemB.colors[0]);
  }

  sortByRarity(itemA:ICard, itemB:ICard):number {
    const rarityRanking = ['Mythic Rare', 'Rare', 'Uncommon', 'Common', 'Basic Land'];
    return rarityRanking.indexOf(itemA.rarity) - rarityRanking.indexOf(itemB.rarity);
  }

  sortByType(itemA:ICard, itemB:ICard):number {
    const typeRanking = ['Planeswalker', 'Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Land'];
    let sortN:number = null;
    typeRanking.forEach((type) => {
      if (sortN === null) {
        if (itemA.types.indexOf(type) !== -1 && itemB.types.indexOf(type) === -1) {
          sortN = -1;
        } else if (itemA.types.indexOf(type) === -1 && itemB.types.indexOf(type) !== -1) {
          sortN = 1;
        } else if (itemA.types.indexOf(type) !== -1 && itemB.types.indexOf(type) !== -1) {
          sortN = 0;
        }
      }      
    });
    return sortN;
  }

  createCardPoolArray(draftData:IDraft, deckCode:string) {
    this.cardPool = [];
    this.cardPoolSwitches = this.translateDeckCode(deckCode);
    
    this.cardPools = Array(2);
    this.cardPools[0] = [];
    this.cardPools[1] = [];

    let cardNameArr = draftData.draft.packs.map((pack, index) => pack[draftData.draft.picks[index]]);
    cardNameArr.map((cardName, index) => {
      draftData.cards.forEach((cardData) => {
        if (cardData.name === cardName) {
          this.cardPool.push(cardData);
          this.cardPools[this.cardPoolSwitches[index] ? 0 : 1].push(cardData);
          return;
        }
      })
    });
  }

  onCardClicked(name:string, isTop:boolean) {
    let cardIndex:number = -1;
    const poolIndex = isTop ? 0 : 1;

    this.cardPools[poolIndex].forEach((eachCard, i) => {
      if (eachCard.name === name) {
        cardIndex = i;
      }
    });

    if (cardIndex >= 0) {
      let card = this.cardPools[poolIndex][cardIndex];
      this.cardPools[poolIndex].splice(cardIndex, 1);
      this.cardPools[(poolIndex + 1) % 2].push(card);
      

      let switched = false;
      this.cardPool.forEach((eachCard, i) => {
        if (!switched && eachCard.name === name && this.cardPoolSwitches[i] === isTop) {
          this.cardPoolSwitches[i] = !this.cardPoolSwitches[i];
          switched = true;
        }
      });
    }    

    this.updateUrl();
    this.sortCardPoolArray(this.sortBy);
  }

  updateUrl() {
    const code = this.translateBoolArray(this.cardPoolSwitches);
    let splitUrl = this._location.path(false).split('?');
    this._location.go(splitUrl[0] + '?d=' + code);
  }
  
  alphanumericAlphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  translateDeckCode(code:string):boolean[] {
    if (!code) {
      return Array(45).fill(true);      
    }

    return this._utils.convertBase(code, this.alphanumericAlphabet, '01')
               .substr(0, 45)
               .split('')               
               .map((number) => number === '1');
  }

  translateBoolArray(array:boolean[]):string {
    return this._utils.convertBase(
      array.reduce((prev, current, index) => 
         index <= 45 ? prev + (current ? '1' : '0') : prev
      , '')
      , '01', this.alphanumericAlphabet);
  }

}
