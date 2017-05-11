import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Uploader } from "angular2-http-file-upload";
import { DraftUploadItem } from "app/draft/draft-upload/draft-upload-item";
import { Router } from '@angular/router';

@Component({
  selector: 'app-draft-upload',
  templateUrl: './draft-upload.component.html',
  styleUrls: ['./draft-upload.component.css']
})
export class DraftUploadComponent implements OnInit {
  draftIds: string[];
  filename: string; 

  constructor(public uploaderService: Uploader,
              private _router: Router) { }

  ngOnInit() {
  }

  submit() {
        let uploadFile = (<HTMLInputElement>window.document.getElementById('draftUploadField')).files[0];
 
        let myUploadItem = new DraftUploadItem(uploadFile);
        //myUploadItem.formData = { FormDataKey: 'Form Data Value' };  // (optional) form data can be sent with file
        this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
          console.log('Uploaded');
          if (response && !response.error) {
            var responseJson = JSON.parse(response);

            if (responseJson.ids.length === 1) {
              this._router.navigate(['/draft', responseJson.ids[0]]);
            } else {
              this.draftIds = responseJson.ids;
              this.filename = responseJson.filename;
            }
          }
        }

        this.uploaderService.upload(myUploadItem);
    }
}
