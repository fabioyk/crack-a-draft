import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { SharedModule } from "app/shared/shared.module";
import { DraftSearchComponent } from './draft-search/draft-search.component';
import { ResultTableComponent } from './result-table/result-table.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'search', component: DraftSearchComponent }
    ])
  ],
  declarations: [DraftSearchComponent, ResultTableComponent],
  exports: [
    DraftSearchComponent
  ]
})
export class DraftSearchModule { }
