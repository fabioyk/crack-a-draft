import { UploadItem }    from 'angular2-http-file-upload';
 
export class DraftUploadItem extends UploadItem {
    constructor(file: any, isAnonymous:boolean) {
        super();        
        this.url = 'https://crack-a-draft.glitch.me/api/draft?date=' + file.lastModified;
        if (isAnonymous) {
            this.url += '&anonymous=true';
        }        

        this.file = file;
    }
}