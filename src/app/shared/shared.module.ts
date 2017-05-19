import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './card/card.component';
import { CardService } from './card.service';
import { DbService } from './db.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent
  ],
  declarations: [ CardComponent ],
  providers: [CardService, DbService]
})
export class SharedModule { }
