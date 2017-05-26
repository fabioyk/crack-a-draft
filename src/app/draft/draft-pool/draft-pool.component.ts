import { Component, OnInit, Input } from '@angular/core';
import { ICard } from "app/card";
import { IDraft } from "app/draft";

@Component({
  selector: 'app-draft-pool',
  templateUrl: './draft-pool.component.html',
  styleUrls: ['./draft-pool.component.css']
})
export class DraftPoolComponent implements OnInit {
  @Input() draftData: IDraft;
  cardPool: ICard[];

  cardPoolTop: ICard[];
  cardPoolBottom: ICard[];

  cardPoolColumnNamesTop: string[];
  cardPoolColumnsTop: ICard[][];
  cardPoolColumnNamesBottom: string[];
  cardPoolColumnsBottom: ICard[][];
  
  sortBy: string;
  isColumnView: boolean;

  constructor() { }

  ngOnInit() {
    this.isColumnView = false;
    if (this.draftData) {
      this.createCardPoolArray(this.draftData);
      this.sortCardPoolArray('color');
    }
  }

   sortCardPoolArray(sortBy:string) {
    this.cardPoolColumnNamesTop = [];
    this.cardPoolColumnNamesBottom = [];
    this.cardPoolColumnsTop = [];
    this.cardPoolColumnsBottom = [];
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
    this.cardPoolTop.sort(sortingObject[sortBy].fullFn);
    this.separateColumns(this.cardPoolTop, sortingObject[sortBy].fn, sortBy, this.cardPoolColumnsTop, this.cardPoolColumnNamesTop);

    this.cardPoolBottom.sort(sortingObject[sortBy].fullFn);
    this.separateColumns(this.cardPoolBottom, sortingObject[sortBy].fn, sortBy, this.cardPoolColumnsBottom, this.cardPoolColumnNamesBottom);

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
        if ((diff !== 0 && attribute !== 'name') || (attribute === 'name' && index % 9 === 0)) {
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

  createCardPoolArray(draftData:IDraft) {
    this.cardPool = [];
    this.cardPoolTop = [];
    this.cardPoolBottom = [];
    let cardNameArr = draftData.draft.packs.map((pack, index) => pack[draftData.draft.picks[index]]);
    cardNameArr.map((cardName) => {
      draftData.cards.forEach((cardData) => {
        if (cardData.name === cardName) {
          this.cardPool.push(cardData);
          this.cardPoolTop.push(cardData);
          return;
        }
      })
    });
  }

  onCardClicked(name:string, isTop:boolean) {
    let card:ICard;
    let cardIndex:number;
    if (isTop) {
      this.cardPoolTop.forEach((eachCard, i) => {
        if (eachCard.name === name) {
          cardIndex = i;
        }
      });
      card = this.cardPoolTop[cardIndex];
      this.cardPoolTop.splice(cardIndex, 1);
      this.cardPoolBottom.push(card);
    } else {
      this.cardPoolBottom.forEach((eachCard, i) => {
        if (eachCard.name === name) {
          cardIndex = i;
        }
      });
      card = this.cardPoolBottom[cardIndex];
      this.cardPoolBottom.splice(cardIndex, 1);
      this.cardPoolTop.push(card);
    }
    this.sortCardPoolArray(this.sortBy);
  }

}
