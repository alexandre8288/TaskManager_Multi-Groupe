import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Ajoutez ici les routes pour les composants dans le module Features
];

@NgModule({
  declarations: [
    // Déclarez ici les composants qui appartiennent à ce module
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Ajoutez d'autres modules nécessaires
  ]
})
export class FeaturesModule { }
