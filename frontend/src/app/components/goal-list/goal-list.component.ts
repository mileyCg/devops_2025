import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../models/goal.model';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>
              <i class="fas fa-list me-2"></i>
              All Goals
            </h1>
            <a routerLink="/goals/new" class="btn btn-primary">
              <i class="fas fa-plus me-1"></i>
              New Goal
            </a>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="row mb-4">
        <div class="col-12">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <button class="nav-link" [class.active]="currentFilter === 'all'" (click)="setFilter('all')">
                All Goals
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" [class.active]="currentFilter === 'active'" (click)="setFilter('active')">
                Active
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" [class.active]="currentFilter === 'expired'" (click)="setFilter('expired')">
                Expired
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" [class.active]="currentFilter === 'upcoming'" (click)="setFilter('upcoming')">
                Upcoming
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Goals List -->
      <div class="row" *ngIf="goals.length > 0; else noGoals">
        <div class="col-lg-6 col-xl-4 mb-4" *ngFor="let goal of goals">
          <div class="card goal-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title">{{ goal.title }}</h5>
                <span class="badge" [ngClass]="getStatusBadgeClass(goal)">
                  {{ getStatusText(goal) }}
                </span>
              </div>
              
              <p class="card-text text-muted" *ngIf="goal.description">{{ goal.description }}</p>
              
              <div class="mb-3" *ngIf="goal.isActive">
                <div class="d-flex justify-content-between mb-1">
                  <small class="text-muted">Progress</small>
                  <small class="text-muted">{{ goal.daysCompleted || 0 }}/{{ (goal.daysCompleted || 0) + (goal.daysRemaining || 0) }} days</small>
                </div>
                <div class="progress">
                  <div class="progress-bar" [style.width.%]="goal.progressPercentage || 0"></div>
                </div>
                <small class="text-muted">{{ (goal.progressPercentage || 0) | number:'1.1-1' }}% complete</small>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  <i class="fas fa-calendar me-1"></i>
                  {{ goal.startDate | date:'MMM dd, yyyy' }} - {{ goal.endDate | date:'MMM dd, yyyy' }}
                </small>
                <div>
                  <a routerLink="/checkin" [queryParams]="{goalId: goal.id}" 
                     class="btn btn-success btn-sm me-1" 
                     *ngIf="goal.isActive">
                    <i class="fas fa-check me-1"></i>
                    Check In
                  </a>
                  <a routerLink="/goals/{{goal.id}}/edit" class="btn btn-outline-primary btn-sm me-1">
                    <i class="fas fa-edit"></i>
                  </a>
                  <button class="btn btn-outline-danger btn-sm" (click)="deleteGoal(goal.id!)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noGoals>
        <div class="row">
          <div class="col-12">
            <div class="text-center py-5">
              <i class="fas fa-target fa-3x text-muted mb-3"></i>
              <h4 class="text-muted">No goals found</h4>
              <p class="text-muted">Create your first goal to get started!</p>
              <a routerLink="/goals/new" class="btn btn-primary">
                <i class="fas fa-plus me-1"></i>
                Create Goal
              </a>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: []
})
export class GoalListComponent implements OnInit {
  goals: Goal[] = [];
  currentFilter = 'all';

  constructor(private goalService: GoalService) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.loadGoals();
  }

  loadGoals(): void {
    switch (this.currentFilter) {
      case 'active':
        this.goalService.getActiveGoals().subscribe(goals => this.goals = goals);
        break;
      case 'expired':
        this.goalService.getExpiredGoals().subscribe(goals => this.goals = goals);
        break;
      case 'upcoming':
        this.goalService.getUpcomingGoals().subscribe(goals => this.goals = goals);
        break;
      default:
        this.goalService.getAllGoals().subscribe(goals => this.goals = goals);
    }
  }

  deleteGoal(goalId: number): void {
    if (confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      this.goalService.deleteGoal(goalId).subscribe({
        next: () => {
          this.loadGoals();
        },
        error: (error) => {
          console.error('Error deleting goal:', error);
          alert('Error deleting goal. Please try again.');
        }
      });
    }
  }

  getStatusText(goal: Goal): string {
    const today = new Date();
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    if (!goal.isActive) {
      return 'Inactive';
    }

    if (today < startDate) {
      return 'Upcoming';
    } else if (today > endDate) {
      return 'Expired';
    } else {
      return 'Active';
    }
  }

  getStatusBadgeClass(goal: Goal): string {
    const today = new Date();
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    if (!goal.isActive) {
      return 'bg-secondary';
    }

    if (today < startDate) {
      return 'bg-info';
    } else if (today > endDate) {
      return 'bg-danger';
    } else {
      return 'bg-success';
    }
  }
}
