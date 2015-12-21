import {Directive, ElementRef, Renderer} from 'angular2/core';

@Directive({
  selector: '[draggable]',
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    '(drag)': 'onDrag($event)'
  }
})
export class Draggable {
  public innerHeight: number;
  public innerWidth: number;
  public Δx: number;
  public Δy: number;
  public nativeEl: Object;

  constructor(
    private el: ElementRef, private renderer: Renderer
  ) {
    this.renderer.setElementAttribute(this.el, 'draggable', 'true');
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
    this.nativeEl = this.el.nativeElement;
  }
  onDragStart(event) {
    this.Δx = event.x - this.nativeEl.offsetLeft ;
    this.Δy = event.y - this.nativeEl.offsetTop;
  }
  onDrag(event) {
    this.doTranslation(event.x, event.y);
  }
  onDragEnd(event) {
    this.Δx = 0;
    this.Δy = 0;
  }
  doTranslation(x, y) {
    if (!x || !y) return;
    this.renderer.setElementStyle(this.el, 'top', (y-this.Δy) + 'px');
    this.renderer.setElementStyle(this.el, 'left', (x-this.Δx) + 'px');
  }

}
