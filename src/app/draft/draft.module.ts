import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { RouterModule} from '@angular/router';

import { DraftUploadComponent } from './draft-upload/draft-upload.component';
import { TooltipModule, AlertModule, TabsModule, ButtonsModule } from "ngx-bootstrap";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AlertModule,
    FormsModule,
    RouterModule.forChild([]),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  declarations: [
    DraftUploadComponent
  ],
  exports: [
    DraftUploadComponent
  ]
})
export class DraftModule { }
