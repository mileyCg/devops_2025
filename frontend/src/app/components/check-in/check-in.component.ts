import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { CheckInService } from '../../services/checkin.service';
import { Goal } from '../../models/goal.model';
import { CheckIn } from '../../models/checkin.model';

@Component({
  selector: 'app-check-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">
            <i class="fas fa-check-circle me-2"></i>
            Daily Check-in
          </h1>
        </div>
      </div>

      <!-- Goal Selection -->
      <div class="row mb-4" *ngIf="!selectedGoal">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Select a Goal to Check In</h5>
            </div>
            <div class="card-body">
              <div class="row" *ngIf="activeGoals.length > 0; else noActiveGoals">
                <div class="col-lg-6 col-xl-4 mb-3" *ngFor="let goal of activeGoals">
                  <div class="card goal-card h-100" (click)="selectGoal(goal)" style="cursor: pointer;">
                    <div class="card-body">
                      <h6 class="card-title">{{ goal.title }}</h6>
                      <p class="card-text text-muted small" *ngIf="goal.description">{{ goal.description }}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                          {{ goal.startDate | date:'MMM dd' }} - {{ goal.endDate | date:'MMM dd' }}
                        </small>
                        <span class="badge bg-primary">{{ goal.progressPercentage | number:'1.1-1' }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #noActiveGoals>
                <div class="text-center py-4">
                  <i class="fas fa-target fa-2x text-muted mb-3"></i>
                  <h5 class="text-muted">No active goals</h5>
                  <p class="text-muted">Create a goal first to start checking in!</p>
                  <a routerLink="/goals/new" class="btn btn-primary">
                    <i class="fas fa-plus me-1"></i>
                    Create Goal
                  </a>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- Check-in Form -->
      <div class="row" *ngIf="selectedGoal">
        <div class="col-lg-8">
          <div class="checkin-form">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4>Check-in for: {{ selectedGoal.title }}</h4>
              <button class="btn btn-outline-secondary btn-sm" (click)="goBack()">
                <i class="fas fa-arrow-left me-1"></i>
                Back to Goals
              </button>
            </div>

            <form [formGroup]="checkInForm" (ngSubmit)="onSubmit()">
              <div class="mb-4">
                <label class="form-label">How are you feeling today?</label>
                <div class="mood-selector">
                  <button
                    type="button"
                    class="mood-btn"
                    [class.selected]="checkInForm.get('mood')?.value === 1"
                    (click)="setMood(1)"
                  >
                    😢
                  </button>
                  <button
                    type="button"
                    class="mood-btn"
                    [class.selected]="checkInForm.get('mood')?.value === 2"
                    (click)="setMood(2)"
                  >
                    😕
                  </button>
                  <button
                    type="button"
                    class="mood-btn"
                    [class.selected]="checkInForm.get('mood')?.value === 3"
                    (click)="setMood(3)"
                  >
                    😐
                  </button>
                  <button
                    type="button"
                    class="mood-btn"
                    [class.selected]="checkInForm.get('mood')?.value === 4"
                    (click)="setMood(4)"
                  >
                    😊
                  </button>
                  <button
                    type="button"
                    class="mood-btn"
                    [class.selected]="checkInForm.get('mood')?.value === 5"
                    (click)="setMood(5)"
                  >
                    😄
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label for="notes" class="form-label">Notes (optional)</label>
                <textarea
                  class="form-control"
                  id="notes"
                  formControlName="notes"
                  rows="4"
                  placeholder="How did it go today? Any thoughts or reflections..."
                ></textarea>
              </div>

              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" (click)="goBack()">
                  <i class="fas fa-arrow-left me-1"></i>
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  [disabled]="isSubmitting"
                >
                  <i class="fas fa-spinner fa-spin me-1" *ngIf="isSubmitting"></i>
                  <i class="fas fa-check me-1" *ngIf="!isSubmitting"></i>
                  {{ isSubmitting ? 'Checking In...' : 'Check In' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Goal Progress -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Goal Progress</h6>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <small class="text-muted">Progress</small>
                  <small class="text-muted">{{ selectedGoal.daysCompleted || 0 }}/{{ (selectedGoal.daysCompleted || 0) + (selectedGoal.daysRemaining || 0) }} days</small>
                </div>
                <div class="progress">
                  <div class="progress-bar" [style.width.%]="selectedGoal.progressPercentage || 0"></div>
                </div>
                <small class="text-muted">{{ (selectedGoal.progressPercentage || 0) | number:'1.1-1' }}% complete</small>
              </div>

              <div class="mb-3">
                <small class="text-muted">
                  <i class="fas fa-calendar me-1"></i>
                  {{ selectedGoal.startDate | date:'MMM dd, yyyy' }} - {{ selectedGoal.endDate | date:'MMM dd, yyyy' }}
                </small>
              </div>

              <div class="mb-3">
                <small class="text-muted">
                  <i class="fas fa-clock me-1"></i>
                  {{ selectedGoal.daysRemaining }} days remaining
                </small>
              </div>

              <div *ngIf="existingCheckIn">
                <hr>
                <h6 class="text-success">
                  <i class="fas fa-check-circle me-1"></i>
                  Already checked in today!
                </h6>
                <p class="small text-muted mb-1">{{ existingCheckIn.notes }}</p>
                <div class="d-flex align-items-center" *ngIf="existingCheckIn.mood">
                  <span class="small me-2">Mood:</span>
                  <div class="mood-display">
                    <i class="fas fa-smile" *ngFor="let i of getMoodArray(existingCheckIn.mood)" 
                       [class.text-warning]="i <= existingCheckIn.mood"></i>
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
export class CheckInComponent implements OnInit {
  activeGoals: Goal[] = [];
  selectedGoal: Goal | null = null;
  existingCheckIn: CheckIn | null = null;
  checkInForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private goalService: GoalService,
    private checkInService: CheckInService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checkInForm = this.fb.group({
      notes: [''],
      mood: [3] // Default to neutral mood
    });
  }

  ngOnInit(): void {
    this.loadActiveGoals();
    
    // Check if a specific goal is selected via query params
    this.route.queryParams.subscribe(params => {
      if (params['goalId']) {
        const goalId = +params['goalId'];
        this.goalService.getGoalById(goalId).subscribe(goal => {
          this.selectGoal(goal);
        });
      }
    });
  }

  loadActiveGoals(): void {
    this.goalService.getActiveGoals().subscribe(goals => {
      this.activeGoals = goals;
    });
  }

  selectGoal(goal: Goal): void {
    this.selectedGoal = goal;
    this.checkExistingCheckIn();
  }

  checkExistingCheckIn(): void {
    if (this.selectedGoal) {
      const today = new Date().toISOString().split('T')[0];
      this.checkInService.getCheckInForGoalAndDate(this.selectedGoal.id!, today).subscribe({
        next: (checkIn) => {
          this.existingCheckIn = checkIn;
        },
        error: () => {
          this.existingCheckIn = null;
        }
      });
    }
  }

  setMood(mood: number): void {
    this.checkInForm.patchValue({ mood });
  }

  goBack(): void {
    this.selectedGoal = null;
    this.existingCheckIn = null;
    this.checkInForm.reset({ notes: '', mood: 3 });
  }

  onSubmit(): void {
    if (this.selectedGoal && !this.existingCheckIn) {
      this.isSubmitting = true;
      const today = new Date().toISOString().split('T')[0];
      
      const checkInData = {
        goalId: this.selectedGoal.id!,
        checkInDate: today,
        notes: this.checkInForm.value.notes,
        mood: this.checkInForm.value.mood
      };

      this.checkInService.createCheckIn(checkInData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error creating check-in:', error);
          this.isSubmitting = false;
          alert('Error creating check-in. Please try again.');
        }
      });
    }
  }

  getMoodArray(mood: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}
