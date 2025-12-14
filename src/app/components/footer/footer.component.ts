import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  hotline = "15145";

  moreLinks = [
    { name: 'About Us', path: '/aboutus' },
    { name: 'Contact Us', path: '/contactus' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy & Policy', path: '/privacy' }
  ];

  solutions = [
    { name: 'Exchange And Return Policy', path: '/exchange' },
    { name: 'Our Products', path: '/products' }
  ];
  address = "Qena, Egypt";

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
