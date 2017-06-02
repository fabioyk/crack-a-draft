import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

var self;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('footer') elementView: ElementRef;
  footerHeight: number;

  ngOnInit() {
    self = this;
    window.onresize = this.updateFooterHeight;
    this.updateFooterHeight();
  }

  updateFooterHeight() {
    self.footerHeight = self.elementView.nativeElement.offsetHeight;
  }
}
