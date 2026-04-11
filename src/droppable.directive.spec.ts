import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DragDropService, DropEvent } from './drag-drop.service';
import { DroppableDirective } from './droppable.directive';

// ---------------------------------------------------------------------------
// Helper: set what document.elementsFromPoint returns for the next call(s)
// ---------------------------------------------------------------------------

function mockElementsAt(...elements: Element[]): void {
  (document.elementsFromPoint as jest.Mock).mockReturnValue(elements);
}

// ---------------------------------------------------------------------------
// Host component
// ---------------------------------------------------------------------------

@Component({
  standalone: true,
  imports: [DroppableDirective],
  template: `
    <div
      [droppable]="enabled"
      (itemDropped)="drops.push($event)"
      (dragEnter)="enters.push(true)"
      (dragLeave)="leaves.push(true)"
    ></div>
  `,
})
class HostComponent {
  enabled: boolean | string = true;
  drops:  DropEvent[] = [];
  enters: true[]      = [];
  leaves: true[]      = [];
}

// ---------------------------------------------------------------------------
// DroppableDirective
// ---------------------------------------------------------------------------

describe('DroppableDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let service: DragDropService;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    host    = fixture.componentInstance;
    service = TestBed.inject(DragDropService);
    el      = fixture.debugElement.query(By.directive(DroppableDirective)).nativeElement;
  });

  afterEach(() => {
    (document.elementsFromPoint as jest.Mock).mockReturnValue([]);
    jest.restoreAllMocks();
  });

  // ─── Registration ─────────────────────────────────────────────────────────

  describe('registration', () => {
    it('should register its element with DragDropService on init', () => {
      mockElementsAt(el);
      const drops: DropEvent[] = [];
      service.drop$.subscribe(e => drops.push(e));

      service.startDrag(document.createElement('div'));
      service.endDrag(0, 0, 'data');

      expect(drops.length).toBe(1);
    });

    it('should unregister its element on destroy', () => {
      fixture.destroy();

      mockElementsAt(el);
      const drops: DropEvent[] = [];
      service.drop$.subscribe(e => drops.push(e));

      service.startDrag(document.createElement('div'));
      service.endDrag(0, 0, 'data');

      expect(drops.length).toBe(0);
    });
  });

  // ─── itemDropped output ───────────────────────────────────────────────────

  describe('(itemDropped)', () => {
    it('should emit with full DropEvent when dropped onto this element', () => {
      const source = document.createElement('div');
      mockElementsAt(el);

      service.startDrag(source);
      service.endDrag(100, 200, 'payload');

      expect(host.drops.length).toBe(1);
      expect(host.drops[0].data).toBe('payload');
      expect(host.drops[0].sourceElement).toBe(source);
      expect(host.drops[0].targetElement).toBe(el);
      expect(host.drops[0].x).toBe(100);
      expect(host.drops[0].y).toBe(200);
    });

    it('should not emit when the drop lands on a different element', () => {
      mockElementsAt(document.createElement('div'));
      service.startDrag(document.createElement('div'));
      service.endDrag(0, 0, 'data');

      expect(host.drops.length).toBe(0);
    });

    it('should not emit when disabled via false', () => {
      host.enabled = false;
      fixture.detectChanges();

      mockElementsAt(el);
      service.startDrag(document.createElement('div'));
      service.endDrag(0, 0, 'data');

      expect(host.drops.length).toBe(0);
    });

    it('should not emit when disabled via string "false"', () => {
      host.enabled = 'false';
      fixture.detectChanges();

      mockElementsAt(el);
      service.startDrag(document.createElement('div'));
      service.endDrag(0, 0, 'data');

      expect(host.drops.length).toBe(0);
    });

    it('should resume emitting after being re-enabled', () => {
      host.enabled = false;
      fixture.detectChanges();
      host.enabled = true;
      fixture.detectChanges();

      mockElementsAt(el);
      service.startDrag(document.createElement('div'));
      service.endDrag(0, 0, 'data');

      expect(host.drops.length).toBe(1);
    });
  });

  // ─── dragEnter / dragLeave ────────────────────────────────────────────────

  describe('(dragEnter) and (dragLeave)', () => {
    it('should emit dragEnter when drag moves over this element', () => {
      mockElementsAt(el);
      service.startDrag(document.createElement('div'));
      service.updateDragPosition(0, 0);

      expect(host.enters.length).toBe(1);
    });

    it('should emit dragLeave when drag moves away', () => {
      mockElementsAt(el);
      service.startDrag(document.createElement('div'));
      service.updateDragPosition(0, 0); // enter

      mockElementsAt(); // nothing at new position
      service.updateDragPosition(999, 999); // leave

      expect(host.leaves.length).toBe(1);
    });

    it('should emit dragLeave when drag ends over this element', () => {
      mockElementsAt(el);
      service.startDrag(document.createElement('div'));
      service.updateDragPosition(0, 0); // enter
      service.endDrag(0, 0, 'data');    // endDrag triggers leave cleanup

      expect(host.leaves.length).toBe(1);
    });

    it('should not emit dragEnter when disabled', () => {
      host.enabled = false;
      fixture.detectChanges();

      mockElementsAt(el);
      service.startDrag(document.createElement('div'));
      service.updateDragPosition(0, 0);

      expect(host.enters.length).toBe(0);
    });

    it('should still emit dragLeave when disabled (allows host to reset UI)', () => {
      // Enter while enabled
      mockElementsAt(el);
      service.startDrag(document.createElement('div'));
      service.updateDragPosition(0, 0);

      // Disable then move away
      host.enabled = false;
      fixture.detectChanges();
      mockElementsAt();
      service.updateDragPosition(999, 999);

      expect(host.leaves.length).toBe(1);
    });
  });
});

// ---------------------------------------------------------------------------
// DragDropService – unit tests
// ---------------------------------------------------------------------------

describe('DragDropService', () => {
  let service: DragDropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DragDropService);
  });

  afterEach(() => {
    (document.elementsFromPoint as jest.Mock).mockReturnValue([]);
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('drop targeting', () => {
    it('should skip the source element and drop onto the element behind it', () => {
      const source = document.createElement('div');
      const target = document.createElement('div');
      service.registerDroppable(source);
      service.registerDroppable(target);
      mockElementsAt(source, target); // source is on top

      const drops: DropEvent[] = [];
      service.drop$.subscribe(e => drops.push(e));

      service.startDrag(source);
      service.endDrag(0, 0, 'data');

      expect(drops[0].targetElement).toBe(target);
    });

    it('should not emit drop when no droppable is found at the position', () => {
      mockElementsAt();
      const drops: DropEvent[] = [];
      service.drop$.subscribe(e => drops.push(e));

      service.startDrag(document.createElement('div'));
      service.endDrag(0, 0, 'data');

      expect(drops.length).toBe(0);
    });

    it('should not emit drop if endDrag is called without startDrag', () => {
      const target = document.createElement('div');
      service.registerDroppable(target);
      mockElementsAt(target);

      const drops: DropEvent[] = [];
      service.drop$.subscribe(e => drops.push(e));

      service.endDrag(0, 0, 'data'); // no startDrag → sourceEl is null

      expect(drops.length).toBe(0);
    });
  });

  describe('enter / leave transitions', () => {
    it('should emit enter and leave as cursor moves between two droppables', () => {
      const a = document.createElement('div');
      const b = document.createElement('div');
      service.registerDroppable(a);
      service.registerDroppable(b);

      const enters: HTMLElement[] = [];
      const leaves: HTMLElement[] = [];
      service.dragEnter$.subscribe(el => enters.push(el));
      service.dragLeave$.subscribe(el => leaves.push(el));

      service.startDrag(document.createElement('div'));

      mockElementsAt(a);
      service.updateDragPosition(0, 0); // enter A

      mockElementsAt(b);
      service.updateDragPosition(1, 1); // leave A, enter B

      expect(enters).toEqual([a, b]);
      expect(leaves).toEqual([a]);
    });

    it('should not emit duplicate enter events when position stays over the same element', () => {
      const a = document.createElement('div');
      service.registerDroppable(a);
      mockElementsAt(a);

      const enters: HTMLElement[] = [];
      service.dragEnter$.subscribe(el => enters.push(el));

      service.startDrag(document.createElement('div'));
      service.updateDragPosition(0, 0);
      service.updateDragPosition(1, 0);
      service.updateDragPosition(2, 0);

      expect(enters.length).toBe(1);
    });
  });
});
