import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GoalListComponent } from './components/goal-list/goal-list.component';
import { GoalFormComponent } from './components/goal-form/goal-form.component';
import { CheckInComponent } from './components/check-in/check-in.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'goals', component: GoalListComponent },
  { path: 'goals/new', component: GoalFormComponent },
  { path: 'goals/:id/edit', component: GoalFormComponent },
  { path: 'checkin', component: CheckInComponent },
  { path: '**', redirectTo: '/dashboard' }
];
