import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface FeatureFlags {
  newDashboard: boolean;
  advancedAnalytics: boolean;
  betaFeatures: boolean;
  darkMode: boolean;
  experimentalFeatures: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private flags: FeatureFlags = {
    newDashboard: false,
    advancedAnalytics: false,
    betaFeatures: false,
    darkMode: false,
    experimentalFeatures: false
  };

  constructor(private http: HttpClient) {
    this.loadFlags();
  }

  private loadFlags(): void {
    // Load from environment or API
    const version = (window as any).APP_VERSION || 'v1';
    
    switch (version) {
      case 'v2':
        this.flags = {
          newDashboard: true,
          advancedAnalytics: true,
          betaFeatures: true,
          darkMode: true,
          experimentalFeatures: false
        };
        break;
      case 'beta':
        this.flags = {
          newDashboard: true,
          advancedAnalytics: true,
          betaFeatures: true,
          darkMode: true,
          experimentalFeatures: true
        };
        break;
      default:
        this.flags = {
          newDashboard: false,
          advancedAnalytics: false,
          betaFeatures: false,
          darkMode: false,
          experimentalFeatures: false
        };
    }
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag];
  }

  getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  // Load flags from API (for dynamic configuration)
  loadFlagsFromAPI(): Observable<FeatureFlags> {
    return this.http.get<FeatureFlags>('/api/feature-flags');
  }
}
