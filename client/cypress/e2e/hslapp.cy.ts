const BASE_URL = 'http://localhost:5173';

describe('Hsl bike app', function () {
  it('front page can be opened', function () {
    cy.visit(BASE_URL);
    cy.contains('Welcome to Helsinki City Bike App');
  });

  describe('Station page', function () {
    beforeEach(function () {
      cy.visit(`${BASE_URL}/station`);
    });

    it('station page can be opened', function () {
      cy.contains('Station');
    });

    it('open new station page', function () {
      cy.contains('Create new').click();
    });

    it('can create a new station', function () {
      cy.get('#createNew').click();
      cy.get('#nameFi').type('Helsinki, linja-autoasema, Kamppi');
      cy.get('#addressFi').type('Helsinki 00100');
      cy.get('#cityFi').type('Helsinki');
      cy.get('#operator').type('Hsl');
      cy.get('#capacity').type('50');
      cy.get('#coordinates').type('60.168884, 24.931723');

      cy.get('#save').click();
      cy.contains('Station created successfully');
    });

    it('can create a new station', function () {
      cy.get('#createNew').click();
      cy.get('#nameFi').type('Myyrmaki asema');
      cy.get('#addressFi').type('Vantaa  01600');
      cy.get('#cityFi').type('Vantaa');
      cy.get('#operator').type('Hsl');
      cy.get('#capacity').type('50');
      cy.get('#coordinates').type('60.261222, 24.855633');

      cy.get('#save').click();
      cy.contains('Station created successfully');
    });

    it('Same station cannot be create twice', function () {
      cy.get('#create-new').click();
      cy.get('#nameFi').type('');
      cy.get('#addressFi').type('Sandesh marg');
      cy.get('#cityFi').type('Helsinki');
      cy.get('#operator').type('Sandesh yatayat');
      cy.get('#capacity').type('50');
      cy.get('#coordinates').type('51,90');

      cy.get('#save').click();
      cy.contains('Journey cannot be created.');
    });
  });

  describe('Journey page', function () {
    beforeEach(function () {
      cy.visit(`${BASE_URL}/journey`);
    });

    it('journey page can be opened', function () {
      cy.contains('Departure');
    });

    it('open new journey page', function () {
      cy.get('#createNew').click();
    });

    it('can create a new journey', function () {
      cy.get('#createNew').click();
      cy.get('#departureId').select('Helsinki, linja-autoasema, Kamppi');
      cy.get('#departureDate').type('Helsinki 00100');
      cy.get('#returnId').select('Helsinki');
      cy.get('#returnDate').type('Hsl');
      cy.get('#distance').type('50');

      cy.get('#save').click();
      cy.contains('Journey created successfully');
    });
  });
});
