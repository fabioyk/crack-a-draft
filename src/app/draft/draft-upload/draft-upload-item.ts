import { UploadItem }    from 'angular2-http-file-upload';
 
export class DraftUploadItem extends UploadItem {
    constructor(file: any) {
        super();
        this.url = 'https://crack-a-draft.glitch.me/api/draft';
        //this.headers = { Content-Type: 'multipart/form-data'};
        this.file = file;
    }
}