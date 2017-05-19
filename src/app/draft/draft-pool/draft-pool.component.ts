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
  sortBy: string;

  constructor() { }

  ngOnInit() {
    if (this.draftData) {
      this.createCardPoolArray(this.draftData);
      this.sortCardPoolArray('color');
    }
  }

   sortCardPoolArray(sortBy:string) {
    this.sortBy = sortBy;
    switch(sortBy) {
      case 'name': {
        this.cardPool.sort(this.sortByName);
        break;
      }
      case 'cmc': {
        this.cardPool.sort((a,b) => this.usePoolSorters(
            [this.sortByCmc, this.sortByColor, 
            this.sortByType, this.sortByName], 
            a, b));
        break;
      }
      case 'color': {
        this.cardPool.sort((a,b) => this.usePoolSorters(
            [this.sortByColor, this.sortByType, 
            this.sortByCmc, this.sortByName], 
            a, b));
        break;
      }
    }
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
    if (itemA.colorIdentity === null && itemB.colorIdentity)
      return 1;
    if (itemA.colorIdentity && itemB.colorIdentity === null)
      return -1;
    if (itemA.colorIdentity === null && itemB.colorIdentity === null)
      return 0;
    if (itemA.colorIdentity.length > 1 && itemB.colorIdentity.length === 1)
      return 1;
    if (itemA.colorIdentity.length === 1 && itemB.colorIdentity.length > 1)
      return -1;
    if (itemA.colorIdentity.length > 1 && itemB.colorIdentity.length > 1)
      return 0;
    return colors.indexOf(itemA.colorIdentity[0]) - colors.indexOf(itemB.colorIdentity[0]);
  }

  sortByRarity(itemA:ICard, itemB:ICard):number {
    const rarityRanking = ['Mythic Rare', 'Rare', 'Uncommon', 'Common', 'Basic Land'];
    return rarityRanking.indexOf(itemA.rarity) - rarityRanking.indexOf(itemB.rarity);
  }

  sortByType(itemA:ICard, itemB:ICard):number {
    const typeRanking = ['Planeswalker', 'Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Land'];
    let sortN:number = 0;
    typeRanking.forEach((type) => {
      if (itemA.types.indexOf(type) !== -1 && itemB.types.indexOf(type) === -1) {
        sortN = 1;
        return;
      } else if (itemA.types.indexOf(type) === -1 && itemB.types.indexOf(type) !== -1) {
        sortN = -1;
        return;
      }
    });
    return sortN;
  }


  createCardPoolArray(draftData:IDraft) {
    this.cardPool = [];
    let cardNameArr = draftData.draft.packs.map((pack, index) => pack[draftData.draft.picks[index]]);
    cardNameArr.map((cardName) => {
      draftData.cards.forEach((cardData) => {
        if (cardData.name === cardName) {
          this.cardPool.push(cardData);
          return;
        }
      })
    });
  }

}
