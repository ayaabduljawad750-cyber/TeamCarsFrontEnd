import { Component, Input } from '@angular/core';
import { Icategory, Icompany } from './home.component.models';
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
      imgUrl: "./assets/images/HomeImgs/categories/spare-part.webp",
      hover: "./assets/images/HomeImgs/categories/spare-light.png"
    },
        {
      id: 2,
      title:"Tyres",
          imgUrl: "/assets/images/HomeImgs/categories/tyre.webp",
            hover: "./assets/images/HomeImgs/categories/tyre-light.webp"
    },
            {
      id: 3,
      title:"Engine oil",
              imgUrl: "/assets/images/HomeImgs/categories/oil.webp",
            hover: "./assets/images/HomeImgs/categories/oil-light.webp"
    },
                {
      id: 4,
      title:"Batteries",
                  imgUrl: "/assets/images/HomeImgs/categories/battery.webp",
            hover: "./assets/images/HomeImgs/categories/battery-light.webp"
    },
                    {
      id: 5,
      title:"Liquids",
                      imgUrl: "/assets/images/HomeImgs/categories/liquid.webp",
            hover: "./assets/images/HomeImgs/categories/liquid-light.webp"
  }
  ]
  hoverIndex: number | null = null;

  readonly companies: Array<Icompany> = [
    {
      id: 1,
      imgUrl: "/assets/images/HomeImgs/companies/1.webp"
    },
     {
      id: 2,
      imgUrl: "/assets/images/HomeImgs/companies/2.webp"
    },
      {
      id: 3,
      imgUrl: "/assets/images/HomeImgs/companies/3.webp"
    },
     {
      id: 4,
      imgUrl: "/assets/images/HomeImgs/companies/4.webp"
    }
     , {
      id: 5,
      imgUrl: "/assets/images/HomeImgs/companies/5.webp"
    },
      {
      id: 6,
      imgUrl: "/assets/images/HomeImgs/companies/6.webp"
    }

  ]


  category1 = this.categories[0];
  category2 = this.categories[1];
  category3 = this.categories[2];
  category4 = this.categories[3];
  category5 = this.categories[4];


  company1 = this.companies[0]
  company2= this.companies[1]
  company3=this.companies[2]
  company4=this.companies[3]
  company5=this.companies[4]
  company6=this.companies[5]



}


//  enum: ["Spare parts", "Tyres", "Engine oil", "Batteries", "Liquids"],
//     required: true,
