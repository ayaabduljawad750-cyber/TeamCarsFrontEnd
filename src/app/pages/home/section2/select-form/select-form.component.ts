import { Component } from '@angular/core';
import { CarModel } from "../../home.component.models"

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css']
})
export class SelectFormComponent {
  carTypes: string[] = [
   'Select car model',
  'Toyota',
  'Honda',
  'Nissan',
  'Hyundai',
  'Kia',
  'Ford',
  'Chevrolet',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Porsche',
  'Tesla',
  'Volvo',
  'Lexus',
  'Mazda',
  'Subaru',
  'Mitsubishi',
  'Peugeot',
  'Renault',
  'Fiat',
  'Ferrari',
  'Lamborghini',
  'Bentley',
  'Rolls-Royce',
  'Jaguar',
  'Land Rover',
  'Mini',
  'Jeep',
  'Dodge'
];

  selectedCar: string = '';
    cars: CarModel[] = [
    { id: 1, model: 'Toyota Corolla' },
    { id: 2, model: 'Honda Civic' },
    { id: 3, model: 'BMW X5' },
    { id: 4, model: 'Mercedes C200' }
  ];

  selectedCarId: number | null = null;
}
