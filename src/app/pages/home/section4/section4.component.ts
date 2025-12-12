import { Component, Input } from '@angular/core';
import { Icompany } from '../home.component.models';

@Component({
  selector: 'app-section4',
  templateUrl: './section4.component.html',
  styleUrls: ['./section4.component.css']
})
export class Section4Component {
  @Input() company: Icompany = {} as Icompany;
}
