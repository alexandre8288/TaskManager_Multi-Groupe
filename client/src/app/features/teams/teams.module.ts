import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TeamDetailComponent],
  imports: [CommonModule, SharedModule],
})
export class TeamsModule {}
