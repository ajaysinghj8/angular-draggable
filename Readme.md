# Angular Draggable

An Angular directive library that makes any HTML element draggable and provides a drop-target directive with developer hooks.

[![npm version](https://badge.fury.io/js/angular-draggable.svg)](https://www.npmjs.com/package/angular-draggable)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Requirements

- Angular **19+**
- RxJS **7+**
- zone.js **0.15+**

---

## Installation

```bash
npm install angular-draggable
```

---

## Quick start

### Standalone components (recommended)

```ts
import { DraggableDirective, DroppableDirective } from 'angular-draggable';

@Component({
  standalone: true,
  imports: [DraggableDirective, DroppableDirective],
  template: `...`
})
export class AppComponent {}
```

### NgModule

```ts
import { NgDraggableModule } from 'angular-draggable';

@NgModule({
  imports: [NgDraggableModule],
})
export class AppModule {}
```

---

## Draggable directive

Apply `[draggable]` to any element that has `position: absolute`, `fixed`, or `relative`.

```html
<!-- Always draggable -->
<div draggable style="position: fixed;">Drag me</div>

<!-- Conditionally draggable -->
<div [draggable]="isDraggable" style="position: fixed;">Drag me</div>

<!-- With drag data passed to the drop target -->
<div [draggable]="true" [dragData]="{ id: 1, label: 'Task A' }" style="position: fixed;">
  Task A
</div>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `[draggable]` | `boolean \| 'true' \| 'false'` | `true` | Enable or disable dragging |
| `[dragData]` | `unknown` | `undefined` | Arbitrary data forwarded to the drop target |

---

## Droppable directive

Apply `[droppable]` to any element you want to act as a drop zone.

```html
<div
  droppable
  (itemDropped)="onDrop($event)"
  (dragEnter)="isOver = true"
  (dragLeave)="isOver = false"
  [class.highlight]="isOver"
>
  Drop zone
</div>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `[droppable]` | `boolean \| 'true' \| 'false'` | `true` | Enable or disable this drop zone |

| Output | Payload | When |
|---|---|---|
| `(itemDropped)` | `DropEvent` | A draggable element is released over this zone |
| `(dragEnter)` | `void` | The cursor enters the zone during a drag |
| `(dragLeave)` | `void` | The cursor leaves the zone, or the drag ends |

### DropEvent

```ts
interface DropEvent<T = unknown> {
  data: T;                      // value from [dragData]
  sourceElement: HTMLElement;   // the element being dragged
  targetElement: HTMLElement;   // the drop zone element
  x: number;                    // drop x coordinate (clientX)
  y: number;                    // drop y coordinate (clientY)
}
```

### Example handler

```ts
import { DropEvent } from 'angular-draggable';

onDrop(event: DropEvent<{ id: number; label: string }>): void {
  console.log(`Dropped "${event.data.label}" at (${event.x}, ${event.y})`);
}
```

---

## Full example

```html
<!-- Draggable items -->
<div
  *ngFor="let item of items"
  [draggable]="true"
  [dragData]="item"
  [style.top]="item.top"
  [style.left]="item.left"
  style="position: fixed;"
>
  {{ item.label }}
</div>

<!-- Drop zones -->
<div
  droppable
  (itemDropped)="onDrop('Zone A', $event)"
  (dragEnter)="zoneAOver = true"
  (dragLeave)="zoneAOver = false"
  [class.active]="zoneAOver"
>
  Zone A
</div>

<div
  droppable
  (itemDropped)="onDrop('Zone B', $event)"
  (dragEnter)="zoneBOver = true"
  (dragLeave)="zoneBOver = false"
  [class.active]="zoneBOver"
>
  Zone B
</div>
```

```ts
onDrop(zone: string, event: DropEvent): void {
  console.log(`${event.data} dropped onto ${zone}`);
}
```

---

## Live demo

[https://ajaysinghj8.github.io/angular-draggable](https://ajaysinghj8.github.io/angular-draggable)

---

## Development

```bash
# Build the library
npm run build

# Run tests
npm test

# Run the example app
cd example && npm install && npm start
```

---

## License

MIT © [Ajay Singh](https://github.com/ajaysinghj8)
