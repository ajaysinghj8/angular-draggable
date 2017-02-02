import { loadConfigurationFromPath } from 'tslint/lib/configuration';
import { log } from './../ng2logger.config';
import { element } from 'protractor';
import { Observable } from 'rxjs/Observable';
import { Directive, ElementRef, EventEmitter, Renderer, OnDestroy, HostListener, OnInit } from '@angular/core';

import 'rxjs/add/operator/startWith';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective implements OnInit, OnDestroy {
  down$;
  move$;
  up$;
  dragging = false;
  private Δx: number = 0;
  private Δy: number = 0;
  private mustBePosition: string[] = ['absolute', 'fixed', 'relative'];

  constructor(
    private el: ElementRef, private renderer: Renderer
  ) {
    try {
      if (this.mustBePosition.indexOf(this.el.nativeElement.style.position) === -1) {
        this.el.nativeElement.style.position = "relative";
        console.warn(this.el.nativeElement, 'Must be having position attribute set to ' + this.mustBePosition.join('|') + ", defaulting to relative.");
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  @HostListener('mouseup', ['$event'])
  onMouseup(event) {
    this.Δx = 0;
    this.Δy = 0;
    this.dragging = false;
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    event.preventDefault();
    this.Δx = event.x - this.el.nativeElement.offsetLeft;
    this.Δy = event.y - this.el.nativeElement.offsetTop;
    this.dragging = true;
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event) { if (this.dragging) { this.doTranslation(event.x, event.y); } }



  ngOnInit() {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'true');
  }
  public ngOnDestroy(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'false');
  }


  doTranslation(x: number, y: number) {
    if (!x || !y) { return; }
    this.renderer.setElementStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
    this.renderer.setElementStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
  }
}
