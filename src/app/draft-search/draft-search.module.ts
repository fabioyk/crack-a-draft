import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { SharedModule } from "app/shared/shared.module";
import { DraftSearchComponent } from './draft-search/draft-search.component';
import { PaginationModule, TooltipModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";
import { DraftBadgeComponent } from './draft-badge/draft-badge.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule,
  ],
  declarations: [DraftSearchComponent, DraftBadgeComponent],
  exports: [
    DraftSearchComponent,
    DraftBadgeComponent
  ]
})
export class DraftSearchModule { }
