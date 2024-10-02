import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-tag',
  templateUrl: './circle-tag.component.html',
  styleUrl: './circle-tag.component.scss',
})
export class CircleTagComponent {
  @Input() outsideColor: string = '#006EE9';
  @Input() insideColor: string = '#006EE9';
}
