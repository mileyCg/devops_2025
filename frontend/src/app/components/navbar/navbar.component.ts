import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fas fa-target me-2"></i>
          Goal Tracker
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/goals" routerLinkActive="active">
                <i class="fas fa-list me-1"></i>
                Goals
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/goals/new" routerLinkActive="active">
                <i class="fas fa-plus me-1"></i>
                New Goal
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/checkin" routerLinkActive="active">
                <i class="fas fa-check-circle me-1"></i>
                Check In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-link.active {
      font-weight: 600;
    }
  `]
})
export class NavbarComponent {
}
