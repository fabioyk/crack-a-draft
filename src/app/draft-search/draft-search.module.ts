import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { SharedModule } from "app/shared/shared.module";
import { DraftSearchComponent } from './draft-search/draft-search.component';
import { PaginationModule, TooltipModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule,
  ],
  declarations: [DraftSearchComponent],
  exports: [
    DraftSearchComponent
  ]
})
export class DraftSearchModule { }
