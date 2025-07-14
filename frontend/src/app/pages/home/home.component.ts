import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor() { }

  // Méthodes pour les interactions futures
  navigateToFeature(feature: string) {
    console.log(`Navigation vers: ${feature}`);
  }
}
