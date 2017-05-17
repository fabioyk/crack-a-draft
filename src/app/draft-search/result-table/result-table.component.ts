import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { IDraft } from "app/draft";
import { DbService } from "app/shared/db.service";

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {
  private draftData: IDraft[];

  pageSize: number;
  pageNumber: number;
  @Input() username: string;

  @Input() isPaginated: boolean;  
  private totalDraftCount: number;
  private totalPages: number;

  private errorMessage: string;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.pageSize = 20;
    this.pageNumber = 0;    
    if (!this.username) this.username = null;
    if (!this.isPaginated) this.isPaginated = false;

    this.refreshTable();
  }

  ngOnChanges() {
    this.hardRefreshTable();
  }

  hardRefreshTable() {
    this.pageNumber = 0;
    this.refreshTable();
  }

  refreshTable() {    
    console.log('searching for',this.username);
    this.draftData = null;
    this._dbService.getDraftsCount(this.username)
      .subscribe(count => {
        if (count.error) {
          this.errorMessage = count.error;
        } else {
          this.totalDraftCount = count.count;
          this.totalPages = Math.ceil(this.totalDraftCount / this.pageSize) - 1;
        }
      },
      error => this.errorMessage = <any> error);
    this._dbService.getDrafts(this.username, this.pageSize, this.pageNumber)
        .subscribe(drafts =>  {
          if (drafts[0].error) {
            this.errorMessage = drafts[0].error;
            this.draftData = [];
          } else {
            this.draftData = drafts;
          }
        },
      error => this.errorMessage = <any>error);
  }

  onChangePage(direction:number) {
    this.pageNumber += direction;
    this.refreshTable();
  }

}
