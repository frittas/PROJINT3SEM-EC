import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[chartHost]'
})
export class ChartHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
