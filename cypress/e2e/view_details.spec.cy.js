describe('View Details Button', () => {
  it('should navigate to the car details page', () => {
    cy.visit('http://localhost:5174/');

    cy.get('.viewDetails') 
      .contains('View Details')
      .click();

    cy.url().should('include', '/carDetails/');
  });
});
