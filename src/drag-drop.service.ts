import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DropEvent<T = unknown> {
  data: T;
  sourceElement: HTMLElement;
  targetElement: HTMLElement;
  x: number;
  y: number;
}

@Injectable({ providedIn: 'root' })
export class DragDropService {
  private readonly _drop$      = new Subject<DropEvent>();
  private readonly _dragEnter$ = new Subject<HTMLElement>();
  private readonly _dragLeave$ = new Subject<HTMLElement>();

  readonly drop$      = this._drop$.asObservable();
  readonly dragEnter$ = this._dragEnter$.asObservable();
  readonly dragLeave$ = this._dragLeave$.asObservable();

  private readonly droppableEls   = new Set<HTMLElement>();
  private activeDroppableEl: HTMLElement | null = null;
  private sourceEl:          HTMLElement | null = null;

  registerDroppable(el: HTMLElement): void   { this.droppableEls.add(el); }
  unregisterDroppable(el: HTMLElement): void { this.droppableEls.delete(el); }

  startDrag(sourceEl: HTMLElement): void {
    this.sourceEl = sourceEl;
  }

  /** Called on every mousemove — detects enter/leave transitions. */
  updateDragPosition(x: number, y: number): void {
    const target = this.findDroppableAt(x, y);
    if (target !== this.activeDroppableEl) {
      if (this.activeDroppableEl) this._dragLeave$.next(this.activeDroppableEl);
      this.activeDroppableEl = target;
      if (this.activeDroppableEl) this._dragEnter$.next(this.activeDroppableEl);
    }
  }

  /** Called on mouseup — emits the drop event and resets state. */
  endDrag(x: number, y: number, data: unknown): void {
    const target = this.findDroppableAt(x, y);
    if (target && this.sourceEl) {
      this._drop$.next({ data, sourceElement: this.sourceEl, targetElement: target, x, y });
    }
    if (this.activeDroppableEl) {
      this._dragLeave$.next(this.activeDroppableEl);
      this.activeDroppableEl = null;
    }
    this.sourceEl = null;
  }

  /**
   * Uses elementsFromPoint to find the topmost registered droppable at (x, y),
   * skipping the element being dragged itself.
   */
  private findDroppableAt(x: number, y: number): HTMLElement | null {
    for (const el of document.elementsFromPoint(x, y)) {
      if (el === this.sourceEl) continue;
      if (this.droppableEls.has(el as HTMLElement)) return el as HTMLElement;
    }
    return null;
  }
}
