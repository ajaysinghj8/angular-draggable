import { CommonModule } from '@angular/common';
import { DraggableDirective } from './draggable.directive';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
    // Why CommonModule
    // https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#q-browser-vs-common-module
    imports: [CommonModule],
    exports: [DraggableDirective],
    declarations: [DraggableDirective]
})
export class DraggableModule { }
