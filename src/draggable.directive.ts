import { Directive, ElementRef, Renderer2, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[draggable]',
  standalone: true,
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    '(drag)': 'onDrag($event)'
  }
})
export class DraggableDirective implements OnDestroy, OnInit, AfterViewInit {
  private deltaX = 0;
  private deltaY = 0;
  private canDrag = true;

  @Input('draggable')
  set draggable(val: boolean | string) {
    if (val === undefined || val === null || val === '') return;
    this.canDrag = val === true || val === 'true';
  }

  private readonly mustBePosition = ['absolute', 'fixed', 'relative'];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'draggable', 'true');
  }

  ngAfterViewInit(): void {
    try {
      const position = window.getComputedStyle(this.el.nativeElement).position;
      if (!this.mustBePosition.includes(position)) {
        console.warn(this.el.nativeElement, 'Must have position set to ' + this.mustBePosition.join('|'));
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  ngOnDestroy(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'draggable', 'false');
  }

  onDragStart(event: DragEvent): void {
    if (!this.canDrag) return;
    this.deltaX = event.clientX - this.el.nativeElement.offsetLeft;
    this.deltaY = event.clientY - this.el.nativeElement.offsetTop;
  }

  onDrag(event: DragEvent): void {
    if (!this.canDrag) return;
    this.doTranslation(event.clientX, event.clientY);
  }

  onDragEnd(_event: DragEvent): void {
    this.deltaX = 0;
    this.deltaY = 0;
  }

  private doTranslation(x: number, y: number): void {
    if (!x || !y) return;
    this.renderer.setStyle(this.el.nativeElement, 'top', (y - this.deltaY) + 'px');
    this.renderer.setStyle(this.el.nativeElement, 'left', (x - this.deltaX) + 'px');
  }
}