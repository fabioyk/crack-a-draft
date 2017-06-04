import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IDraft } from "app/draft";
import { DbService } from "app/shared/db.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-draft-search',
  templateUrl: './draft-search.component.html',
  styleUrls: ['./draft-search.component.css']
})
export class DraftSearchComponent implements OnInit {
  queryString: string;
  username: string;
  draftData: IDraft[];

  private sub: Subscription;

  public pageSize: number;
  public pageNumber: number;
  public totalDraftCount: number;
  public totalPages: number;

  private errorMessage: string;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _location: Location,
              private _dbService: DbService) { }

  ngOnInit() {
    this.pageSize = 20;

    this.sub = this._route.queryParams.subscribe(
        params => {
            this.username = params['name'];
            this.pageNumber = +params['page'];

            if (this.pageNumber < 0) {
              this.pageNumber = 0;              
            }

            if (!this.username) this.username = null;
            if (!this.pageNumber) this.pageNumber = 0;

            this.refreshTable();            
    });
  }

  onButtonClick(name: string) {
    this.username = name.trim();    
    this.hardRefreshTable();
  }

  hardRefreshTable() {
    this.pageNumber = 0;    
    this.refreshTable();
  }

  refreshTable() {
    if (this.pageNumber < 0) {
      this.pageNumber = 0;
    }
    this.updateUrl();
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

  updateUrl() {
    let url = '/';
    if (this.username && this.username !== '') {
      url += '?name=' + this.username;
    }
    if (this.pageNumber > 0) {
      if (url.length === 1) {
        url += '?';
      } else {
        url += '&';
      }
      url += 'page=' + this.pageNumber;
    }    
    this._location.go(url);
  }

}
