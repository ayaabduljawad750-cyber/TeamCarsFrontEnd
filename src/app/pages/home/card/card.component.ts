import { Component, Input } from '@angular/core';
import { Icategory } from '../home.component.models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() category: Icategory = {} as Icategory;
    hoverIndex: number | null = null;

  
}
