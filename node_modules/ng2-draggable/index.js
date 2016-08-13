"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var Draggable = (function () {
    function Draggable(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.Δx = 0;
        this.Δy = 0;
        this.mustBePosition = ['absolute', 'fixed', 'relative'];
        try {
            if (this.mustBePosition.indexOf(this.el.nativeElement.style.position) === -1) {
                console.warn(this.el.nativeElement, 'Must be having position attribute set to ' + this.mustBePosition.join('|'));
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    Draggable.prototype.ngOnInit = function () {
        this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'true');
    };
    Draggable.prototype.onDragStart = function (event) {
        this.Δx = event.x - this.el.nativeElement.offsetLeft;
        this.Δy = event.y - this.el.nativeElement.offsetTop;
    };
    Draggable.prototype.onDrag = function (event) {
        this.doTranslation(event.x, event.y);
    };
    Draggable.prototype.onDragEnd = function (event) {
        this.Δx = 0;
        this.Δy = 0;
    };
    Draggable.prototype.doTranslation = function (x, y) {
        if (!x || !y)
            return;
        this.renderer.setElementStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
        this.renderer.setElementStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
    };
    Draggable.prototype.ngOnDestroy = function () {
        this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'false');
    };
    Draggable = __decorate([
        core_1.Directive({
            selector: '[draggable]',
            host: {
                '(dragstart)': 'onDragStart($event)',
                '(dragend)': 'onDragEnd($event)',
                '(drag)': 'onDrag($event)'
            }
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], Draggable);
    return Draggable;
}());
exports.Draggable = Draggable;
var DRAGGABLE_DIRECTIVES = [Draggable];
var DraggableModule = (function () {
    function DraggableModule() {
    }
    DraggableModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            exports: DRAGGABLE_DIRECTIVES,
            declarations: DRAGGABLE_DIRECTIVES
        }), 
        __metadata('design:paramtypes', [])
    ], DraggableModule);
    return DraggableModule;
}());
exports.DraggableModule = DraggableModule;
//# sourceMappingURL=index.js.map