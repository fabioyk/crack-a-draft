import { Component, OnInit, Input } from '@angular/core';
import { IDraft } from "app/draft";
import { UtilsService } from "app/shared/utils.service";

@Component({
  selector: 'app-draft-picks',
  templateUrl: './draft-picks.component.html',
  styleUrls: ['./draft-picks.component.css']
})
export class DraftPicksComponent implements OnInit {
  @Input() draftData: IDraft;

  constructor(private _utilsService: UtilsService) { }

  ngOnInit() {
  }

  calculatePackPickString(index:number):string {
    return this._utilsService.calculatePackPickString(index);
  }
}
