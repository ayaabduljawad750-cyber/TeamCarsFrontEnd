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
// images = [
//   // {
//   //   normal: "./assets/images/HomeImgs/categories/spare-part.webp",

//   // },
//   // {
//   //   normal: 'assets/img2.png',
//   //   hover: 'assets/img2-hover.png'
//   // },
//   // {
//   //   normal: 'assets/img3.png',
//   //   hover: 'assets/img3-hover.png'
//   // }
// ];
//
}
