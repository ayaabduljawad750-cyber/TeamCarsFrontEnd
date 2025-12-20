import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Icategory } from '../home.component.models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() category!: Icategory;   // الكاتيجوري جاي من الهوم
  @Output() categoryClicked = new EventEmitter<string>(); // event رايح للهوم

  onClick() {
    this.categoryClicked.emit(this.category.title);
  }
}
