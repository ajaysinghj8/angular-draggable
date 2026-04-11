import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DraggableDirective } from './draggable.directive';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mouseEvent(type: string, clientX = 0, clientY = 0): MouseEvent {
  return new MouseEvent(type, { clientX, clientY, bubbles: true, cancelable: true });
}

function setOffsets(el: HTMLElement, left: number, top: number): void {
  Object.defineProperty(el, 'offsetLeft', { value: left, configurable: true });
  Object.defineProperty(el, 'offsetTop',  { value: top,  configurable: true });
}

// ---------------------------------------------------------------------------
// Host components
// ---------------------------------------------------------------------------

@Component({
  standalone: true,
  imports: [DraggableDirective],
  template: `<div [draggable]="enabled" style="position: fixed; top: 100px; left: 50px;"></div>`,
})
class PositionedHostComponent {
  enabled: boolean | string = true;
}

@Component({
  standalone: true,
  imports: [DraggableDirective],
  template: `<div draggable></div>`,
})
class UnpositionedHostComponent {}

// ---------------------------------------------------------------------------
// Suite A – position warning (needs its own TestBed config, no shared beforeEach)
// ---------------------------------------------------------------------------

describe('DraggableDirective – position warning', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnpositionedHostComponent],
    }).compileComponents();
  });

  afterEach(() => jest.restoreAllMocks());

  it('should not warn when element has a valid CSS position', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [PositionedHostComponent],
    }).compileComponents();

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    TestBed.createComponent(PositionedHostComponent).detectChanges();

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('should warn when element has no valid CSS position', () => {
    jest
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ position: 'static' } as CSSStyleDeclaration);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    TestBed.createComponent(UnpositionedHostComponent).detectChanges();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.anything(),
      'Must have position set to absolute|fixed|relative'
    );
  });
});

// ---------------------------------------------------------------------------
// Suite B – all other behaviour
// ---------------------------------------------------------------------------

describe('DraggableDirective', () => {
  let fixture: ComponentFixture<PositionedHostComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionedHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PositionedHostComponent);
    fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(DraggableDirective)).nativeElement;
  });

  afterEach(() => {
    // Clean up any dangling document listeners from a drag in progress
    document.dispatchEvent(new MouseEvent('mouseup'));
    document.body.style.userSelect = '';
    jest.restoreAllMocks();
  });

  // ─── Creation ─────────────────────────────────────────────────────────────

  describe('creation', () => {
    it('should create the directive', () => {
      expect(el).toBeTruthy();
    });

    it('should set cursor to grab on the host element', () => {
      expect(el.style.cursor).toBe('grab');
    });
  });

  // ─── @Input('draggable') ──────────────────────────────────────────────────

  describe('@Input draggable', () => {
    it('should ignore empty-string and leave state unchanged', () => {
      (fixture.componentInstance as any).enabled = '';
      fixture.detectChanges();
      expect(el.style.cursor).toBe('grab');
    });

    it('should set cursor to default when input is false', () => {
      fixture.componentInstance.enabled = false;
      fixture.detectChanges();
      expect(el.style.cursor).toBe('default');
    });

    it('should set cursor to default when input is the string "false"', () => {
      fixture.componentInstance.enabled = 'false';
      fixture.detectChanges();
      expect(el.style.cursor).toBe('default');
    });

    it('should restore cursor to grab when re-enabled with true', () => {
      fixture.componentInstance.enabled = false;
      fixture.detectChanges();
      fixture.componentInstance.enabled = true;
      fixture.detectChanges();
      expect(el.style.cursor).toBe('grab');
    });

    it('should restore cursor to grab when re-enabled with the string "true"', () => {
      fixture.componentInstance.enabled = false;
      fixture.detectChanges();
      fixture.componentInstance.enabled = 'true';
      fixture.detectChanges();
      expect(el.style.cursor).toBe('grab');
    });
  });

  // ─── mousedown ────────────────────────────────────────────────────────────

  describe('mousedown', () => {
    it('should do nothing when dragging is disabled', () => {
      fixture.componentInstance.enabled = false;
      fixture.detectChanges();

      const event = mouseEvent('mousedown', 200, 150);
      const preventDefault = jest.spyOn(event, 'preventDefault');
      el.dispatchEvent(event);

      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('should call preventDefault to block text selection', () => {
      const event = mouseEvent('mousedown', 200, 150);
      const preventDefault = jest.spyOn(event, 'preventDefault');
      el.dispatchEvent(event);

      expect(preventDefault).toHaveBeenCalled();
    });

    it('should change cursor to grabbing', () => {
      el.dispatchEvent(mouseEvent('mousedown', 200, 150));
      expect(el.style.cursor).toBe('grabbing');
    });

    it('should set body user-select to none', () => {
      el.dispatchEvent(mouseEvent('mousedown', 200, 150));
      expect(document.body.style.userSelect).toBe('none');
    });

    it('should not update position when dragging is disabled', () => {
      fixture.componentInstance.enabled = false;
      fixture.detectChanges();
      setOffsets(el, 50, 100);

      el.dispatchEvent(mouseEvent('mousedown', 200, 150));

      const leftBefore = el.style.left;
      document.dispatchEvent(mouseEvent('mousemove', 400, 300));

      // Position must be unchanged — disabled drag never attaches a mousemove listener
      expect(el.style.left).toBe(leftBefore);
    });
  });

  // ─── document mousemove ───────────────────────────────────────────────────

  describe('document mousemove (during drag)', () => {
    // offsetLeft=50, offsetTop=100
    // mousedown at clientX=200, clientY=150  →  deltaX=150, deltaY=50
    beforeEach(() => {
      setOffsets(el, 50, 100);
      el.dispatchEvent(mouseEvent('mousedown', 200, 150));
    });

    it('should set left = clientX − deltaX', () => {
      document.dispatchEvent(mouseEvent('mousemove', 300, 250));
      expect(el.style.left).toBe('150px'); // 300 − 150
    });

    it('should set top = clientY − deltaY', () => {
      document.dispatchEvent(mouseEvent('mousemove', 300, 250));
      expect(el.style.top).toBe('200px'); // 250 − 50
    });

    it('should track subsequent moves independently', () => {
      document.dispatchEvent(mouseEvent('mousemove', 300, 250));
      document.dispatchEvent(mouseEvent('mousemove', 500, 400));
      expect(el.style.left).toBe('350px'); // 500 − 150
      expect(el.style.top).toBe('350px');  // 400 − 50
    });

    it('should handle negative resulting positions', () => {
      document.dispatchEvent(mouseEvent('mousemove', 100, 30));
      expect(el.style.left).toBe('-50px'); // 100 − 150
      expect(el.style.top).toBe('-20px');  // 30 − 50
    });
  });

  // ─── document mouseup ─────────────────────────────────────────────────────

  describe('document mouseup (end of drag)', () => {
    beforeEach(() => {
      setOffsets(el, 50, 100);
      el.dispatchEvent(mouseEvent('mousedown', 200, 150));
    });

    it('should reset cursor to grab', () => {
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(el.style.cursor).toBe('grab');
    });

    it('should remove body user-select', () => {
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(document.body.style.userSelect).toBe('');
    });

    it('should detach the mousemove listener so position no longer updates', () => {
      document.dispatchEvent(new MouseEvent('mouseup'));
      document.dispatchEvent(mouseEvent('mousemove', 999, 999));
      // If listener was removed: left ≠ 999 − 150 = 849px
      expect(el.style.left).not.toBe('849px');
    });
  });

  // ─── ngOnDestroy ──────────────────────────────────────────────────────────

  describe('ngOnDestroy', () => {
    it('should remove document listeners so subsequent mousemove has no effect', () => {
      setOffsets(el, 50, 100);
      el.dispatchEvent(mouseEvent('mousedown', 200, 150));

      fixture.destroy();

      document.dispatchEvent(mouseEvent('mousemove', 999, 999));
      // If listener was cleaned up: left ≠ 999 − 150 = 849px
      expect(el.style.left).not.toBe('849px');
    });
  });
});
