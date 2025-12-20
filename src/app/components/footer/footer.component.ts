import { Component, OnInit } from '@angular/core';
 import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit  {
  hotline = "15145";
  moreLinks: any[] = [];
  solutions: any[] = [];
  constructor(
    private translate: TranslateService) {
      const savedLang = localStorage.getItem('lang') || 'en';
  translate.setDefaultLang(savedLang);
  translate.use(savedLang);
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
     }
  ngOnInit(): void {
    this.loadLinks();


    this.translate.onLangChange.subscribe(() => {
      this.loadLinks();
    });
  }

    private loadLinks(): void {
      this.moreLinks = [
      { name: this.translate.instant('FOOTER.MORE_LINKS.ABOUT_US'), path: '/aboutus' },
      { name: this.translate.instant('FOOTER.MORE_LINKS.CONTACT_US'), path: '/contactus' },
      { name: this.translate.instant('FOOTER.MORE_LINKS.TERMS'), path: '/terms' },
      { name: this.translate.instant('FOOTER.MORE_LINKS.PRIVACY'), path: '/privacy' }
    ];

    this.solutions = [
      { name: this.translate.instant('FOOTER.SOLUTIONS_LINKS.EXCHANGE'), path: '/exchange' },
      { name: this.translate.instant('FOOTER.SOLUTIONS_LINKS.PRODUCTS'), path: '/products' }
    ];
}
  address: string = this.translate.instant('FOOTER.ADDRESS');

  socialIcons = [
    { img: 'assets/images/facebook.jpg', link:'https://www.facebook.com' },
    { img: 'assets/images/instagram.jpg', link: 'https://www.instagram.com',},
    { img: 'assets/images/linkedin.jpg', link: 'https://www.linkedin.com',},
  ];
  partners = [
    'assets/images/valu.jpg',
    'assets/images/misr.jpg',
    'assets/images/cib.jpg',
    'assets/images/NBE.jpg',
    'assets/images/mashreq.jpg',
    'assets/images/sympl.jpg',
    'assets/images/souhoola.jpg',
    'assets/images/forsa.jpg',
    'assets/images/premium.jpg',
    'assets/images/halan.jpg',
    'assets/images/meeza.jpg'
  ];
}
