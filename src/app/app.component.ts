import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { WindowRefService } from "app/shared/window-ref.service";

var self;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('footer') elementView: ElementRef;
  footerHeight: number;  
  window: Window;

  constructor(private _windowRef: WindowRefService) {
    this.window = _windowRef.nativeWindow;
  }

  ngOnInit() {
    self = this;
    window.onresize = this.updateFooterHeight;
    this.updateFooterHeight();
  }

  updateFooterHeight() {
    self.footerHeight = self.elementView.nativeElement.offsetHeight;
  }

  gotoTop() {
    this.window.scrollTo(0,0);
  }
}
