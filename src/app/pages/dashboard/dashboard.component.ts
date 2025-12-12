import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private auth: AuthService) { }
  role:string=''
  getRole(){
    return this.role
  }
  ngOnInit() {
    this.auth.getCurrentUser().subscribe({
      next: (res:any) => {
        console.log('Current User:', res);
        this.role=res.data?.user.role
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  //  console.log(this.role)
  }

}
