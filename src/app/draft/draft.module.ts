import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { RouterModule} from '@angular/router';

import { DraftViewerComponent } from "app/draft/draft-viewer/draft-viewer.component";
import { DraftStatsComponent } from './draft-stats/draft-stats.component';
import { DraftUploadComponent } from './draft-upload/draft-upload.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'draft', component: DraftUploadComponent },
      { path: 'draft/:draftId', component: DraftViewerComponent }
    ])
  ],
  declarations: [
    DraftViewerComponent,
    DraftStatsComponent,
    DraftUploadComponent
  ]
})
export class DraftModule { }
