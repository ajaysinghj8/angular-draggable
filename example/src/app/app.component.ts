import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { DraggableDirective } from 'angular-draggable';

interface DraggableBox {
  label: string;
  color: string;
  top: string;
  left: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DraggableDirective, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isDraggable = true;

  boxes: DraggableBox[] = [
    { label: 'Box A', color: '#4f46e5', top: '160px', left: '80px' },
    { label: 'Box B', color: '#0891b2', top: '160px', left: '260px' },
    { label: 'Box C', color: '#059669', top: '160px', left: '440px' },
    { label: 'Box D', color: '#d97706', top: '320px', left: '170px' },
    { label: 'Box E', color: '#db2777', top: '320px', left: '350px' },
  ];

  toggleDragging(): void {
    this.isDraggable = !this.isDraggable;
  }
}
