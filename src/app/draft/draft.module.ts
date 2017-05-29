import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { RouterModule} from '@angular/router';

import { DraftViewerComponent } from "app/draft/draft-viewer/draft-viewer.component";
import { DraftUploadComponent } from './draft-upload/draft-upload.component';
import { DraftPoolComponent } from './draft-pool/draft-pool.component';
import { TooltipModule, AlertModule, TabsModule, ButtonsModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AlertModule,
    FormsModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forChild([
      { path: 'draft', component: DraftUploadComponent },
      { path: 'draft/:draftId', component: DraftViewerComponent }
    ]),
    ButtonsModule.forRoot()
  ],
  declarations: [
    DraftViewerComponent,
    DraftUploadComponent,
    DraftPoolComponent
  ],
  exports: [
    DraftUploadComponent
  ]
})
export class DraftModule { }
