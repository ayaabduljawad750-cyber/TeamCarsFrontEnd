// dashboard.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Observable stream of the current user
  user$: Observable<any>;

  constructor(private auth: AuthService) {
    // Map the response immediately to get the user object
    this.user$ = this.auth.getCurrentUser().pipe(
      map((res: any) => res.data?.user)
    );
  }
}