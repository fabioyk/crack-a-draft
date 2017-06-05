import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Uploader } from "angular2-http-file-upload";
import { DraftUploadItem } from "app/draft/draft-upload/draft-upload-item";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-draft-upload',
  templateUrl: './draft-upload.component.html',
  styleUrls: ['./draft-upload.component.css']
})
export class DraftUploadComponent implements OnInit {
  @Output() uploaded = new EventEmitter<string>();
  draftIds: string[];
  filename: string; 
  isAnonymous: boolean;
  errorMessage: string;
  isSubmitting: boolean;

  constructor(public uploaderService: Uploader,
              private _router: Router,
              private _route: ActivatedRoute) { }

  ngOnInit() {
    this.isSubmitting = false;
  }

  submit() {    
    let uploadFile = (<HTMLInputElement>window.document.getElementById('draftUploadField')).files[0];

    if (uploadFile) {
      this.isSubmitting = true;
      let myUploadItem = new DraftUploadItem(uploadFile, this.isAnonymous);
      //myUploadItem.formData = { FormDataKey: 'Form Data Value' };  // (optional) form data can be sent with file
      this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
        this.isSubmitting = false;
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
        if (response && !response.error) {
          if (response.ids.length === 1) {
            this._router.navigate(['/draft', response.ids[0]]);
          } else {
            this.draftIds = response.ids;
            this.filename = response.filename;
            this.uploaded.emit(response.ids.length.toString());
          }
        } else if (response.error) {
          this.errorMessage = response.error;
        }
      }

      this.uploaderService.upload(myUploadItem);    
    }

    
  }
  
  cleanup() {
    this.draftIds = null;
    this.filename = '';
    this.errorMessage = null;
  }
}
