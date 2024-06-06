describe('Edit Modal Test', () => {
  it('should display edit modal on clicking edit button', () => {
    cy.visit('http://localhost:5174/carDetails/LP048pu4fqqorYhOV0rt'); 

    cy.url().should('include', '/carDetails/LP048pu4fqqorYhOV0rt');

    cy.get('button').contains('Edit').should('exist').click(); 

    cy.wait(500); 

    cy.get('#editModal').should('be.visible').within(() => {
      cy.contains('Edit Car Information'); 
    });
  });
});
