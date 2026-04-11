import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DroppableDirective } from './droppable.directive';

@NgModule({
  imports: [DraggableDirective, DroppableDirective],
  exports: [DraggableDirective, DroppableDirective],
})
export class NgDraggableModule {}
