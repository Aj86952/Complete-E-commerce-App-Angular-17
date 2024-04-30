import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHosting]',
  standalone: true
})
export class HostingDirective {

  constructor(
    private elemRef : ElementRef
  ) { }

  // @HostBinding('style.border') border  : any;
  @HostBinding('style.border') border ? : string;

  @HostListener('click') callFunction(){
    this.border = '5px solid red'
  }


}
