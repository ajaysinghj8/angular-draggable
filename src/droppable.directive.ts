import {
  Directive, ElementRef, EventEmitter, Input,
  OnDestroy, OnInit, Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DragDropService, DropEvent } from './drag-drop.service';

@Directive({
  selector: '[droppable]',
  standalone: true,
})
export class DroppableDirective implements OnInit, OnDestroy {
  /** Set to false / 'false' to temporarily disable this drop zone. */
  @Input() set droppable(val: boolean | string) {
    this.enabled = val !== false && val !== 'false';
  }

  /** Emits when a draggable element is released over this zone. */
  @Output() itemDropped = new EventEmitter<DropEvent>();

  /** Emits when a drag enters the zone — use for visual feedback. */
  @Output() dragEnter = new EventEmitter<void>();

  /** Emits when a drag leaves the zone — use to reset visual feedback. */
  @Output() dragLeave = new EventEmitter<void>();

  private enabled = true;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly service: DragDropService,
  ) {}

  ngOnInit(): void {
    this.service.registerDroppable(this.el.nativeElement);

    this.service.drop$.pipe(
      filter(e => e.targetElement === this.el.nativeElement && this.enabled),
      takeUntil(this.destroy$),
    ).subscribe(e => this.itemDropped.emit(e));

    this.service.dragEnter$.pipe(
      filter(el => el === this.el.nativeElement && this.enabled),
      takeUntil(this.destroy$),
    ).subscribe(() => this.dragEnter.emit());

    this.service.dragLeave$.pipe(
      filter(el => el === this.el.nativeElement),
      takeUntil(this.destroy$),
    ).subscribe(() => this.dragLeave.emit());
  }

  ngOnDestroy(): void {
    this.service.unregisterDroppable(this.el.nativeElement);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
