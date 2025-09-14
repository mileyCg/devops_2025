export interface Goal {
  id?: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  daysRemaining?: number;
  daysCompleted?: number;
  progressPercentage?: number;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}
