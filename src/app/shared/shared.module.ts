import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './card/card.component';
import { CardService } from './card.service';
import { DbService } from './db.service';
import { UtilsService } from './utils.service';
import { TooltipModule } from "ngx-bootstrap";
import { WindowRefService } from './window-ref.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent
  ],
  declarations: [ CardComponent ],
  providers: [CardService, DbService, UtilsService, WindowRefService]
})
export class SharedModule { }
