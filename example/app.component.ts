import {Component} from '@angular/core';

@Component({
    selector: 'my-app',
    template: `<div [draggable] style="position:fixed;"> <h1> Ajay Singh </h1> </div>
    <div [draggable] style="position:fixed;"> <h1> is </h1> </div>
    <div [draggable] style="position:fixed;"> <h1> a </h1> </div>
    <div [draggable] style="position:fixed;"> <h1> JavaScript </h1> </div>
    <div [draggable] style="position:fixed;"> <h1> developer</h1> </div>
    <div [draggable] style="position:fixed;"> <h1> . </h1> </div>
    <div [draggable] style="position:fixed;"> <h1> Full Stack </h1> </div>`
})
export class AppComponent { }
