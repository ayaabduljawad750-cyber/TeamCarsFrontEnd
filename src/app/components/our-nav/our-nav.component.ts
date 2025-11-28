import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-our-nav',
  templateUrl: './our-nav.component.html',
  styleUrls: ['./our-nav.component.css']
})
export class OurNavComponent {
constructor(private auth: AuthService){}
logout(){
  this.auth.logout()
}
isLogin(){return this.auth.isLogin()?"yes":"no"} 
}
