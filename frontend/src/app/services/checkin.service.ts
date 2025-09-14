import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckIn, CreateCheckInRequest } from '../models/checkin.model';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  private apiUrl = 'http://localhost:8080/api/checkins';

  constructor(private http: HttpClient) { }

  getCheckInsForGoal(goalId: number): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.apiUrl}/goal/${goalId}`);
  }

  getCheckInForGoalAndDate(goalId: number, date: string): Observable<CheckIn> {
    return this.http.get<CheckIn>(`${this.apiUrl}/goal/${goalId}/date/${date}`);
  }

  createCheckIn(checkIn: CreateCheckInRequest): Observable<CheckIn> {
    return this.http.post<CheckIn>(this.apiUrl, checkIn);
  }

  updateCheckIn(id: number, checkIn: CheckIn): Observable<CheckIn> {
    return this.http.put<CheckIn>(`${this.apiUrl}/${id}`, checkIn);
  }

  deleteCheckIn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCheckInsForDateRange(goalId: number, startDate: string, endDate: string): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.apiUrl}/goal/${goalId}/range?startDate=${startDate}&endDate=${endDate}`);
  }

  getCheckInCountForGoal(goalId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/goal/${goalId}/count`);
  }

  getRecentCheckInsForGoal(goalId: number, limit: number = 10): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.apiUrl}/goal/${goalId}/recent?limit=${limit}`);
  }
}
