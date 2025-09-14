import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../models/goal.model';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">
                <i class="fas fa-plus me-2" *ngIf="!isEditMode"></i>
                <i class="fas fa-edit me-2" *ngIf="isEditMode"></i>
                {{ isEditMode ? 'Edit Goal' : 'Create New Goal' }}
              </h3>
            </div>
            <div class="card-body">
              <form [formGroup]="goalForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="title" class="form-label">Goal Title *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    formControlName="title"
                    placeholder="Enter your goal title"
                    [class.is-invalid]="goalForm.get('title')?.invalid && goalForm.get('title')?.touched"
                  >
                  <div class="invalid-feedback" *ngIf="goalForm.get('title')?.invalid && goalForm.get('title')?.touched">
                    <div *ngIf="goalForm.get('title')?.errors?.['required']">Title is required</div>
                    <div *ngIf="goalForm.get('title')?.errors?.['maxlength']">Title must not exceed 200 characters</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    class="form-control"
                    id="description"
                    formControlName="description"
                    rows="3"
                    placeholder="Describe your goal (optional)"
                    [class.is-invalid]="goalForm.get('description')?.invalid && goalForm.get('description')?.touched"
                  ></textarea>
                  <div class="invalid-feedback" *ngIf="goalForm.get('description')?.invalid && goalForm.get('description')?.touched">
                    Description must not exceed 1000 characters
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="startDate" class="form-label">Start Date *</label>
                      <input
                        type="date"
                        class="form-control"
                        id="startDate"
                        formControlName="startDate"
                        [class.is-invalid]="goalForm.get('startDate')?.invalid && goalForm.get('startDate')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="goalForm.get('startDate')?.invalid && goalForm.get('startDate')?.touched">
                        Start date is required
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="endDate" class="form-label">End Date *</label>
                      <input
                        type="date"
                        class="form-control"
                        id="endDate"
                        formControlName="endDate"
                        [class.is-invalid]="goalForm.get('endDate')?.invalid && goalForm.get('endDate')?.touched"
                      >
                      <div class="invalid-feedback" *ngIf="goalForm.get('endDate')?.invalid && goalForm.get('endDate')?.touched">
                        End date is required
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-3" *ngIf="isEditMode">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="isActive"
                      formControlName="isActive"
                    >
                    <label class="form-check-label" for="isActive">
                      Active Goal
                    </label>
                  </div>
                </div>

                <div class="alert alert-info" *ngIf="goalForm.get('startDate')?.value && goalForm.get('endDate')?.value">
                  <i class="fas fa-info-circle me-2"></i>
                  <strong>Duration:</strong> {{ getDurationDays() }} days
                  <span *ngIf="getDurationDays() > 30" class="text-warning ms-2">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    This goal is longer than 30 days
                  </span>
                </div>

                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" routerLink="/goals">
                    <i class="fas fa-arrow-left me-1"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="goalForm.invalid || isSubmitting"
                  >
                    <i class="fas fa-spinner fa-spin me-1" *ngIf="isSubmitting"></i>
                    <i class="fas fa-save me-1" *ngIf="!isSubmitting"></i>
                    {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Goal' : 'Create Goal') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class GoalFormComponent implements OnInit {
  goalForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  goalId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private goalService: GoalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.goalForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.goalId = +params['id'];
        this.loadGoal();
      } else {
        // Set default start date to today for new goals
        const today = new Date().toISOString().split('T')[0];
        this.goalForm.patchValue({
          startDate: today
        });
      }
    });

    // Add custom validator for end date
    this.goalForm.get('endDate')?.addValidators(this.endDateValidator.bind(this));
  }

  loadGoal(): void {
    if (this.goalId) {
      this.goalService.getGoalById(this.goalId).subscribe({
        next: (goal) => {
          this.goalForm.patchValue({
            title: goal.title,
            description: goal.description,
            startDate: goal.startDate,
            endDate: goal.endDate,
            isActive: goal.isActive
          });
        },
        error: (error) => {
          console.error('Error loading goal:', error);
          this.router.navigate(['/goals']);
        }
      });
    }
  }

  endDateValidator(control: any) {
    const startDate = this.goalForm?.get('startDate')?.value;
    const endDate = control.value;
    
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { endDateInvalid: true };
    }
    return null;
  }

  getDurationDays(): number {
    const startDate = this.goalForm.get('startDate')?.value;
    const endDate = this.goalForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      this.isSubmitting = true;
      const goalData = this.goalForm.value;

      if (this.isEditMode && this.goalId) {
        this.goalService.updateGoal(this.goalId, goalData).subscribe({
          next: () => {
            this.router.navigate(['/goals']);
          },
          error: (error) => {
            console.error('Error updating goal:', error);
            this.isSubmitting = false;
          }
        });
      } else {
        this.goalService.createGoal(goalData).subscribe({
          next: () => {
            this.router.navigate(['/goals']);
          },
          error: (error) => {
            console.error('Error creating goal:', error);
            this.isSubmitting = false;
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.goalForm.controls).forEach(key => {
        this.goalForm.get(key)?.markAsTouched();
      });
    }
  }
}
