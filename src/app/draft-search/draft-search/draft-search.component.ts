import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-draft-search',
  templateUrl: './draft-search.component.html',
  styleUrls: ['./draft-search.component.css']
})
export class DraftSearchComponent implements OnInit {
  nameSearch: string;
  isPaginated: boolean;

  constructor() { }

  ngOnInit() {
  }

  onButtonClick(name: string) {
    console.log(name);
    this.nameSearch = name;
    this.isPaginated = this.nameSearch !== '';

    
  }

}
