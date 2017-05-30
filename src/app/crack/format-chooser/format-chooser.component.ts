import { Component, OnInit } from '@angular/core';
import { DbService } from "app/shared/db.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IFormat } from "app/format";


@Component({
  selector: 'app-format-chooser',
  templateUrl: './format-chooser.component.html',
  styleUrls: ['./format-chooser.component.css']
})
export class FormatChooserComponent implements OnInit {
  formatList:IFormat[];
  errorMessage: string;
  chosenFormat: string;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _dbService: DbService) { }

  ngOnInit() {
    this._dbService.getFormats()
      .subscribe(formats =>  {
        if (formats[0].error) {
          this.errorMessage = formats[0].error;
        } else {
          this.formatList = formats;
          let draftCount = formats.reduce((prev, curr) => prev + curr.drafts, 0);
          this.formatList.push({
            name: 'All Random',
            mtgoName: 'random',
            drafts: draftCount,
            error: null
          });
          this.chosenFormat = formats[0].mtgoName + ',' + formats[0].drafts;
        }          
      },
    error => this.errorMessage = <any>error);
  }
  
  onSubmit(format:string):void {
    this._dbService.getDraftByFormat(format)
      .subscribe(draft =>  {
        if (draft.error) {
          this.errorMessage = draft.error;
        } else {          
          this._router.navigate(['/crack', draft.draft._id]);
        }          
      },
    error => this.errorMessage = <any>error);
  }

  onChange(selectedFormat):void {
    this.chosenFormat = selectedFormat;
  }
}
