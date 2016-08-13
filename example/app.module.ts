import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';
import { BrowserModule  }           from '@angular/platform-browser';

import { AppComponent }             from './app.component';
import { DraggableModule }          from '../lib';


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        DraggableModule
    ],
    declarations: [AppComponent ],
    exports: [AppComponent],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
