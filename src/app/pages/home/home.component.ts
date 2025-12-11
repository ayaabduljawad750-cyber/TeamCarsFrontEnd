import { Component, Input } from '@angular/core';
import { Icategory } from './home.component.models';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // catergories
  readonly categories: Array<Icategory> = [
    {
      id: 1,
      title:"Spare parts",
      imgUrl:"./assets/images/HomeImgs/categories/spare-part.webp"
    },
        {
      id: 2,
      title:"Tyres",
      imgUrl:"/assets/images/HomeImgs/categories/tyre.webp"
    },
            {
      id: 3,
      title:"Engine oil",
      imgUrl:"/assets/images/HomeImgs/categories/oil.webp"
    },
                {
      id: 4,
      title:"Batteries",
      imgUrl:"/assets/images/HomeImgs/categories/battery.webp"
    },
                    {
      id: 5,
      title:"Liquids",
      imgUrl:"/assets/images/HomeImgs/categories/liquid.webp"
  }
  ]

  category1 = this.categories[0];
  category2 = this.categories[1];
  category3 = this.categories[2];
  category4 = this.categories[3];
  category5 = this.categories[4];

}


//  enum: ["Spare parts", "Tyres", "Engine oil", "Batteries", "Liquids"],
//     required: true,
