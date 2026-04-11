import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';

@NgModule({
  imports: [DraggableDirective],
  exports: [DraggableDirective]
})
export class NgDraggableModule {}
