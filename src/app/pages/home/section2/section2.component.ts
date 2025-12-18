import { Component, OnInit } from '@angular/core';
import { MaintenanceService, MaintenanceCenter } from '../../../services/maintenance.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-section2',
  templateUrl: './section2.component.html',
  styleUrls: ['./section2.component.css'],
animations: [
  trigger('expandCollapse', [
    transition(':enter', [
      style({ height: 0, opacity: 0 }),
      animate('400ms ease-out', style({ height: '*', opacity: 1 }))
    ]),
    transition(':leave', [
      animate('400ms ease-in', style({ height: 0, opacity: 0 }))
    ])
  ])
]

})
export class Section2Component implements OnInit {
  centers: MaintenanceCenter[] = [];
  loading: boolean = false;
  showAll = false;

visibleCount = 4;

  constructor(private _maintenanceService: MaintenanceService) {

  }


  ngOnInit(): void {
    this.getAllCenters();
  }

  getAllCenters(): void {
    this.loading = true;
    this._maintenanceService.getCenters().subscribe((res) => {
      this.centers = res.data.centers;
      console.log(this.centers)
      this.loading = false;
    }, (err) => {
        console.error('Centers load Error:', err);
        this.loading = false;
      },
    );
    
  }
  getVisibleCenters(): MaintenanceCenter[] {
  if (!this.centers) return [];
  return this.showAll ? this.centers : this.centers.slice(0, 4);
}

toggleShowAll(): void {
  this.showAll = !this.showAll;
}
}
