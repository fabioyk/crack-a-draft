import { Component, OnInit } from '@angular/core';
import { IDraft } from "app/draft";
import { DbService } from "app/shared/db.service";

@Component({
  selector: 'app-draft-search',
  templateUrl: './draft-search.component.html',
  styleUrls: ['./draft-search.component.css']
})
export class DraftSearchComponent implements OnInit {
  queryString: string;
  username: string;
  isPaginated: boolean;
  draftData: IDraft[];

  public pageSize: number;
  public pageNumber: number;
  public totalDraftCount: number;
  public totalPages: number;

  private errorMessage: string;

  constructor(private _dbService: DbService) { }

  ngOnInit() {
    this.pageSize = 20;
    this.pageNumber = 0;
    if (!this.username) this.username = null;
    if (!this.isPaginated) this.isPaginated = false;

    this.hardRefreshTable();
  }

  onButtonClick(name: string) {
    this.username = name.trim();
    this.isPaginated = this.username !== '';
    this.hardRefreshTable();
  }

  hardRefreshTable() {
    this.pageNumber = 0;
    this.refreshTable();
  }

  refreshTable() {    
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

  pageChanged(event:any) {
    this.pageNumber = event.page-1;    
    this.refreshTable();    
  }

}
