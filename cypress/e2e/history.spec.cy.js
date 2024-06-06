// cypress/e2e/navigation.spec.js
describe('History Button Test', () => {
  it('should navigate to history page when history button is clicked', () => {
    cy.visit('http://localhost:5174'); 

    cy.get('#historyButton').click(); 

    cy.url().should('include', '/history');

    cy.contains('User History').should('be.visible'); 
  });
});
