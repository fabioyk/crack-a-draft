import { UploadItem }    from 'angular2-http-file-upload';
import { environment } from "environments/environment";

 
export class DraftUploadItem extends UploadItem {
    constructor(file: any, isAnonymous:boolean) {
        super();  
        if (environment.production) {
            //this.url = 'https://crack-a-draft.herokuapp.com/api/';
            this.url = 'https://crack-a-draft.glitch.me/api/'            
        } else {
            this.url = 'https://crack-a-draft.glitch.me/api/'
        }      
        this.url += 'draft?date=' + file.lastModified;
        if (isAnonymous) {
            this.url += '&anonymous=true';
        }        

        this.file = file;
    }
}