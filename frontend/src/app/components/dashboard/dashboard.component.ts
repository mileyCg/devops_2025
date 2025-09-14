import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { CheckInService } from '../../services/checkin.service';
import { Goal } from '../../models/goal.model';
import { CheckIn } from '../../models/checkin.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">
            <i class="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </h1>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="stats-card">
            <h3>{{ activeGoalsCount }}</h3>
            <p>Active Goals</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stats-card">
            <h3>{{ completedCheckInsToday }}</h3>
            <p>Check-ins Today</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stats-card">
            <h3>{{ totalCheckIns }}</h3>
            <p>Total Check-ins</p>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stats-card">
            <h3>{{ averageProgress }}%</h3>
            <p>Avg Progress</p>
          </div>
        </div>
      </div>

      <!-- Active Goals -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Active Goals</h2>
            <a routerLink="/goals/new" class="btn btn-primary">
              <i class="fas fa-plus me-1"></i>
              New Goal
            </a>
          </div>
        </div>
      </div>

      <div class="row" *ngIf="activeGoals.length > 0; else noGoals">
        <div class="col-lg-6 col-xl-4 mb-4" *ngFor="let goal of activeGoals">
          <div class="card goal-card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ goal.title }}</h5>
              <p class="card-text text-muted" *ngIf="goal.description">{{ goal.description }}</p>
              
              <div class="mb-3">
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
                  {{ goal.startDate | date:'MMM dd' }} - {{ goal.endDate | date:'MMM dd' }}
                </small>
                <div>
                  <a routerLink="/checkin" [queryParams]="{goalId: goal.id}" class="btn btn-success btn-sm me-1">
                    <i class="fas fa-check me-1"></i>
                    Check In
                  </a>
                  <a routerLink="/goals/{{goal.id}}/edit" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-edit"></i>
                  </a>
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
              <h4 class="text-muted">No active goals yet</h4>
              <p class="text-muted">Start your journey by creating your first goal!</p>
              <a routerLink="/goals/new" class="btn btn-primary">
                <i class="fas fa-plus me-1"></i>
                Create Your First Goal
              </a>
            </div>
          </div>
        </div>
      </ng-template>

      <!-- Recent Check-ins -->
      <div class="row mt-5" *ngIf="recentCheckIns.length > 0">
        <div class="col-12">
          <h3 class="mb-3">Recent Check-ins</h3>
          <div class="row">
            <div class="col-lg-6 col-xl-4 mb-3" *ngFor="let checkIn of recentCheckIns">
              <div class="checkin-card">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="mb-0">{{ getGoalTitle(checkIn.goalId) }}</h6>
                  <small class="text-muted">{{ checkIn.checkInDate | date:'MMM dd, yyyy' }}</small>
                </div>
                <p class="mb-2" *ngIf="checkIn.notes">{{ checkIn.notes }}</p>
                <div class="d-flex align-items-center" *ngIf="checkIn.mood">
                  <span class="me-2">Mood:</span>
                  <div class="mood-display">
                    <i class="fas fa-smile" *ngFor="let i of getMoodArray(checkIn.mood)" [class.text-warning]="i <= checkIn.mood"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  activeGoals: Goal[] = [];
  recentCheckIns: CheckIn[] = [];
  activeGoalsCount = 0;
  completedCheckInsToday = 0;
  totalCheckIns = 0;
  averageProgress = 0;

  constructor(
    private goalService: GoalService,
    private checkInService: CheckInService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.goalService.getActiveGoals().subscribe(goals => {
      this.activeGoals = goals;
      this.activeGoalsCount = goals.length;
      this.calculateAverageProgress();
    });

    this.loadRecentCheckIns();
    this.loadTodayCheckIns();
  }

  loadRecentCheckIns(): void {
    this.goalService.getActiveGoals().subscribe(goals => {
      let allCheckIns: CheckIn[] = [];
      let completed = 0;
      
      goals.forEach(goal => {
        if (goal.id) {
          this.checkInService.getRecentCheckInsForGoal(goal.id, 3).subscribe(checkIns => {
            allCheckIns = allCheckIns.concat(checkIns);
            this.recentCheckIns = allCheckIns
              .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())
              .slice(0, 6);
          });
        }
      });
    });
  }

  loadTodayCheckIns(): void {
    const today = new Date().toISOString().split('T')[0];
    this.goalService.getGoalsForDate(today).subscribe(goals => {
      let completed = 0;
      goals.forEach(goal => {
        if (goal.id) {
          this.checkInService.getCheckInForGoalAndDate(goal.id, today).subscribe({
            next: () => completed++,
            error: () => {} // No check-in for this goal today
          });
        }
      });
      this.completedCheckInsToday = completed;
    });
  }

  calculateAverageProgress(): void {
    if (this.activeGoals.length === 0) {
      this.averageProgress = 0;
      return;
    }
    
    const totalProgress = this.activeGoals.reduce((sum, goal) => sum + (goal.progressPercentage || 0), 0);
    this.averageProgress = totalProgress / this.activeGoals.length;
  }

  getGoalTitle(goalId: number): string {
    const goal = this.activeGoals.find(g => g.id === goalId);
    return goal ? goal.title : 'Unknown Goal';
  }

  getMoodArray(mood: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}
