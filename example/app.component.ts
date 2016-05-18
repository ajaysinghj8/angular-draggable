import {Component} from '@angular/core';
import {Draggable} from '../lib';
@Component({
    selector: 'my-app',
    template: '<div [draggable] style="position:fixed;"> <h1> Ajay Singh </h1> </div>',
    directives: [Draggable] 
})
export class AppComponent { }
