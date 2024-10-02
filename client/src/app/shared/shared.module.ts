import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HighlightDirective } from './directives/highlight.directive';
import { RouterModule } from '@angular/router';
import { CircleTagComponent } from './components/circle-tag/circle-tag.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { StatusComponent } from './components/status/status.component';

@NgModule({
  declarations: [
    InputComponent,
    SelectComponent,
    NavbarComponent,
    HighlightDirective,
    CircleTagComponent,
    ProgressBarComponent,
    StatusComponent,
  ],
  imports: [CommonModule, MatSelectModule, MatInputModule, RouterModule],
  exports: [
    InputComponent,
    SelectComponent,
    NavbarComponent,
    HighlightDirective,
    MatSelectModule,
    MatInputModule,
    CommonModule,
    CircleTagComponent,
    ProgressBarComponent,
    StatusComponent,
  ],
})
export class SharedModule {}
