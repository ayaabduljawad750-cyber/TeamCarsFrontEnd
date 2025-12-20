import { Component } from '@angular/core';
import { Icategory, Icompany } from './home.component.models';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
        private router:Router,
      private translate: TranslateService) {
        const savedLang = localStorage.getItem('lang') || 'en';
    translate.setDefaultLang(savedLang);
    translate.use(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }

  // catergories
  readonly categories: Array<Icategory> = [

  {
    id: 1,
    title: 'CATEGORIES.SPARE_PARTS',
    imgUrl: './assets/images/HomeImgs/categories/spare-part.webp',
    hover: './assets/images/HomeImgs/categories/spare-light.png'
  },
  {
    id: 2,
    title: 'CATEGORIES.TYRES',
    imgUrl: '/assets/images/HomeImgs/categories/tyre.webp',
    hover: './assets/images/HomeImgs/categories/tyre-light.webp'
  },
  {
    id: 3,
    title: 'CATEGORIES.ENGINE_OIL',
    imgUrl: '/assets/images/HomeImgs/categories/oil.webp',
    hover: './assets/images/HomeImgs/categories/oil-light.webp'
  },
  {
    id: 4,
    title: 'CATEGORIES.BATTERIES',
    imgUrl: '/assets/images/HomeImgs/categories/battery.webp',
    hover: './assets/images/HomeImgs/categories/battery-light.webp'
  },
  {
    id: 5,
    title: 'CATEGORIES.LIQUIDS',
    imgUrl: '/assets/images/HomeImgs/categories/liquid.webp',
    hover: './assets/images/HomeImgs/categories/liquid-light.webp'
  }
];

  hoverIndex: number | null = null;

  readonly companies: Array<Icompany> = [
    { id: 1, imgUrl: "/assets/images/HomeImgs/companies/1.webp" },
    { id: 2, imgUrl: "/assets/images/HomeImgs/companies/2.webp" },
    { id: 3, imgUrl: "/assets/images/HomeImgs/companies/3.webp" },
    { id: 4, imgUrl: "/assets/images/HomeImgs/companies/4.webp" },
    { id: 5, imgUrl: "/assets/images/HomeImgs/companies/5.webp" },
    { id: 6, imgUrl: "/assets/images/HomeImgs/companies/6.webp" }
  ];

  goToCategory(category: string) {
    localStorage.setItem('selectedCategory', category); // خزن الكاتيجوري
    this.router.navigate(['/products']); // روح للبروداكتس
  }
}
