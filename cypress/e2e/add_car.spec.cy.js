describe('Add A New Car Modal Test', () => {
  it('should display add new car modal on clicking add button', () => {
    cy.visit('http://localhost:5174/');

    cy.get('button').contains('+').should('exist').click(); 

    cy.wait(500); 

    cy.get('#addCarModal').should('be.visible').within(() => {
      cy.contains('Add New Car'); 
    });
  });
});