describe('Rent Modal Test', () => {
  it('should display rent modal on clicking rent button', () => {
    cy.visit('http://localhost:5174/carDetails/LP048pu4fqqorYhOV0rt'); 

    cy.url().should('include', '/carDetails/LP048pu4fqqorYhOV0rt');

    cy.get('button').contains('Rent').should('exist').click(); 

    cy.wait(500); 

    cy.get('#rentModal').should('be.visible').within(() => {
      cy.contains('Rent a Car'); 
    });
  });
});
