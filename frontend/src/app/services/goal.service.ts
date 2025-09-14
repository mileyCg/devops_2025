import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal, CreateGoalRequest } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = 'http://localhost:8080/api/goals';

  constructor(private http: HttpClient) { }

  getAllGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl);
  }

  getActiveGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/active`);
  }

  getGoalById(id: number): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/${id}`);
  }

  createGoal(goal: CreateGoalRequest): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, goal);
  }

  updateGoal(id: number, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, goal);
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getGoalsForDate(date: string): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/for-date?date=${date}`);
  }

  getExpiredGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/expired`);
  }

  getUpcomingGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/upcoming`);
  }
}
