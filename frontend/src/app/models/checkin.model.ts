export interface CheckIn {
  id?: number;
  goalId: number;
  checkInDate: string;
  notes?: string;
  mood?: number;
}

export interface CreateCheckInRequest {
  goalId: number;
  checkInDate: string;
  notes?: string;
  mood?: number;
}
