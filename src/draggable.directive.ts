import { Directive, ElementRef, Renderer2, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { DragDropService } from './drag-drop.service';

@Directive({
  selector: '[draggable]',
  standalone: true,
  host: {
    '(mousedown)': 'onMouseDown($event)'
  }
})
export class DraggableDirective implements OnDestroy, AfterViewInit {
  /** Enable or disable dragging. Accepts boolean or 'true'/'false' string. */
  @Input('draggable') set draggable(val: boolean | string) {
    if (val === undefined || val === null || val === '') return;
    this.canDrag = val === true || val === 'true';
    this.renderer.setStyle(this.el.nativeElement, 'cursor', this.canDrag ? 'grab' : 'default');
  }

  /** Arbitrary data passed to the drop target via DropEvent.data. */
  @Input() dragData: unknown;

  private canDrag = true;
  private deltaX = 0;
  private deltaY = 0;
  private moveUnlisten?: () => void;
  private upUnlisten?: () => void;

  private readonly mustBePosition = ['absolute', 'fixed', 'relative'];

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly dragDropService: DragDropService,
  ) {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
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
    this.removeDocumentListeners();
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.canDrag) return;
    event.preventDefault();

    this.deltaX = event.clientX - this.el.nativeElement.offsetLeft;
    this.deltaY = event.clientY - this.el.nativeElement.offsetTop;

    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
    this.renderer.setStyle(document.body, 'user-select', 'none');

    this.dragDropService.startDrag(this.el.nativeElement);

    this.moveUnlisten = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
      this.renderer.setStyle(this.el.nativeElement, 'top',  (e.clientY - this.deltaY) + 'px');
      this.renderer.setStyle(this.el.nativeElement, 'left', (e.clientX - this.deltaX) + 'px');
      this.dragDropService.updateDragPosition(e.clientX, e.clientY);
    });

    this.upUnlisten = this.renderer.listen('document', 'mouseup', (e: MouseEvent) => {
      this.dragDropService.endDrag(e.clientX, e.clientY, this.dragData);
      this.removeDocumentListeners();
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
      this.renderer.removeStyle(document.body, 'user-select');
    });
  }

  private removeDocumentListeners(): void {
    this.moveUnlisten?.();
    this.upUnlisten?.();
    this.moveUnlisten = undefined;
    this.upUnlisten  = undefined;
  }
}
