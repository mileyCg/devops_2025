describe('Goal Tracker E2E Tests', () => {
  const baseUrl = Cypress.env('BASE_URL') || 'http://localhost:4200';
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8080';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('should load the dashboard', () => {
    cy.contains('Goal Tracker').should('be.visible');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should create a new goal', () => {
    cy.get('a[routerLink="/goals/new"]').click();
    
    cy.get('input[formControlName="title"]').type('Test Goal');
    cy.get('textarea[formControlName="description"]').type('This is a test goal');
    cy.get('input[formControlName="startDate"]').type('2024-01-01');
    cy.get('input[formControlName="endDate"]').type('2024-01-31');
    
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/goals');
    cy.contains('Test Goal').should('be.visible');
  });

  it('should display goals list', () => {
    cy.visit(`${baseUrl}/goals`);
    cy.contains('All Goals').should('be.visible');
  });

  it('should check in for a goal', () => {
    // First create a goal
    cy.get('a[routerLink="/goals/new"]').click();
    cy.get('input[formControlName="title"]').type('Test Check-in Goal');
    cy.get('input[formControlName="startDate"]').type('2024-01-01');
    cy.get('input[formControlName="endDate"]').type('2024-01-31');
    cy.get('button[type="submit"]').click();
    
    // Then check in
    cy.visit(`${baseUrl}/checkin`);
    cy.contains('Test Check-in Goal').click();
    
    cy.get('button[class*="mood-btn"]').first().click();
    cy.get('textarea[formControlName="notes"]').type('Great progress today!');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
  });

  it('should handle API errors gracefully', () => {
    // Mock API failure
    cy.intercept('GET', '/api/goals', { statusCode: 500 }).as('getGoalsError');
    
    cy.visit(`${baseUrl}/goals`);
    cy.wait('@getGoalsError');
    
    // Should show error state or empty state
    cy.contains('No goals found').should('be.visible');
  });
});
