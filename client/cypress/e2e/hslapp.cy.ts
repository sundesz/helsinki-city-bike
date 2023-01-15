// TODO:: save SERVER_BASE_URL in env file
const SERVER_BASE_URL = 'http://localhost:8080/api/v1';

describe('Hsl bike app', function () {
  beforeEach(function () {
    cy.request('POST', `${SERVER_BASE_URL}/test/reset`);
    cy.visit('/');
  });

  it('front page can be opened', function () {
    cy.contains('Welcome to Helsinki City Bike App');
  });

  describe('Station page', function () {
    beforeEach(function () {
      cy.visit(`/station`);
    });

    it('station page can be opened', function () {
      cy.get('.page-header').should('contain', 'Station List');
    });

    it('new station page can be opened', function () {
      cy.contains('Create new').click();
    });

    it('all fields are required to create a station', function () {
      cy.get('#createNew').click();
      cy.get('#addressFi').type('Sandesh marg');
      cy.get('#cityFi').type('Helsinki');
      cy.get('#operator').type('Sandesh yatayat');
      cy.get('#capacity').clear().type('50');
      cy.get('#coordinates').type('51,90');

      cy.get('#save').click();
      cy.contains('All fields are required.');
    });

    it('valid coordinate required to create a station', function () {
      cy.get('#createNew').click();
      cy.get('#nameFi').type('Station 1');
      cy.get('#addressFi').type('Address 1');
      cy.get('#cityFi').type('City 1');
      cy.get('#operator').type('Operator 1');
      cy.get('#capacity').type('50');
      cy.get('#coordinates').type('60.168884-, a24.931723');

      cy.get('#save').click();
      cy.contains('Invalid coordinates.');
    });

    it('can create a new station', function () {
      cy.get('#createNew').click();
      cy.get('#nameFi').type('Station 1');
      cy.get('#addressFi').type('Address 1');
      cy.get('#cityFi').type('City 1');
      cy.get('#operator').type('Operator 1');
      cy.get('#capacity').clear().type('50');
      cy.get('#coordinates').type('60.168884, 24.931723');

      cy.get('#save').click();
      cy.contains('Station created successfully');

      cy.visit('/station');
      cy.get('.table tbody tr').should(($tableRow) => {
        expect($tableRow).to.have.length(1);
      });
    });

    describe('Station data already exists', function () {
      beforeEach(function () {
        cy.stationTestData(1);
        cy.visit('/station');
      });

      it('same station cannot be create twice', function () {
        cy.get('#createNew').click();
        cy.get('#nameFi').type('Station 1');
        cy.get('#addressFi').type('Address 1');
        cy.get('#cityFi').type('City 1');
        cy.get('#operator').type('Operator 1');
        cy.get('#capacity').clear().type('50');
        cy.get('#coordinates').type('23.84055, 63.1658');

        cy.get('#save').click();
        cy.contains('Station already exists.');
      });

      it('station list can be filtered', function () {
        cy.get('#createNew').click();
        cy.get('#nameFi').type('Station 2');
        cy.get('#addressFi').type('Address 2');
        cy.get('#cityFi').type('City 2');
        cy.get('#operator').type('Operator 2');
        cy.get('#capacity').clear().type('50');
        cy.get('#coordinates').type('22.84055, 62.1658');

        cy.get('#save').click();
        cy.visit('/station');
        cy.get('.table tbody tr').should(($tableRow) => {
          expect($tableRow).to.have.length(2);
        });

        cy.get('#filterValue').type('Station 1{enter}');
        cy.get('.table tbody tr').should(($tableRow) => {
          expect($tableRow).to.have.length(1);
        });
      });

      it('station list can be ordered', function () {
        cy.stationTestData(2);

        cy.visit('/station?page=1&name=&value=&orderBy=name_fi&orderDir=asc');

        // cy.get('#departurestation_asc').click();
        // cy.wait(1000);

        cy.get('.table tbody tr')
          .first()
          .get('td')
          .eq(1)
          .should(($tableColumn) => {
            expect($tableColumn).to.contain('Station 1');
          });

        cy.visit('/station?page=1&name=&value=&orderBy=name_fi&orderDir=desc');

        cy.get('.table tbody tr')
          .first()
          .get('td')
          .eq(1)
          .should(($tableColumn) => {
            expect($tableColumn).to.contain('Station 2');
          });
      });

      it('station detail page can be opened', function () {
        cy.get('.table tbody tr').first().get('td a').first().click();

        cy.contains('Station 1');
      });
    });
  });

  describe('Journey page', function () {
    beforeEach(function () {
      cy.visit(`/journey`);
    });

    it('journey page can be opened', function () {
      cy.get('.page-header').should('contain', 'Journey List');
    });

    it('new journey page can be opened', function () {
      cy.contains('Create new').click();
    });

    it('shows warning when there are less then two station', function () {
      cy.get('#createNew').click();
      cy.contains(
        'Please create at least two station before creating the journey.'
      );
    });

    describe('when there is two stations', function () {
      beforeEach(function () {
        cy.stationTestData(1);
        cy.stationTestData(2);

        cy.visit('/journey/new');
      });

      it('departure and return station should be different when creating a journey', function () {
        cy.get('#departureId').select(1);
        cy.get('#departureDate').type('2023-01-14T23:40');
        cy.get('#returnId').select(1);
        cy.get('#returnDate').type('2023-01-14T23:40');
        cy.get('#distance').clear().type('50');

        cy.get('#save').click();

        cy.contains('Departure and return station should be different.');
      });

      it('departure and return date should be different when creating a journey', function () {
        cy.get('#departureId').select(1);
        cy.get('#departureDate').type('2023-01-14T23:40');
        cy.get('#returnId').select(2);
        cy.get('#returnDate').type('2023-01-14T23:40');
        cy.get('#distance').clear().type('50');

        cy.get('#save').click();

        cy.contains('Return date should be after departure.');
      });

      it('distance covered should have positive value when creating a journey', function () {
        cy.get('#departureId').select(1);
        cy.get('#departureDate').type('2023-01-14T23:50');
        cy.get('#returnId').select(2);
        cy.get('#returnDate').type('2023-01-14T23:55');
        cy.get('#distance').clear();

        cy.get('#save').click();

        cy.contains('Distance covered should be greater than 0.');
      });

      it('journey can be created', function () {
        cy.get('#departureId').select(1);
        cy.get('#departureDate').type('2023-01-14T23:50');
        cy.get('#returnId').select(2);
        cy.get('#returnDate').type('2023-01-15T23:50');
        cy.get('#distance').clear().type('50');

        cy.get('#save').click();

        cy.contains('Journey created successfully.');
      });

      describe('when there is journey data', function () {
        beforeEach(function () {
          cy.journeyTestData();

          cy.visit('/journey/new');
        });

        it('same journey cannot be created twice', function () {
          cy.get('#departureId').select(1);
          cy.get('#departureDate').type('2023-01-14T13:50');
          cy.get('#returnId').select(2);
          cy.get('#returnDate').type('2023-01-14T14:50');
          cy.get('#distance').clear().type('50');

          cy.get('#save').click();

          cy.contains('Journey detail already exits.');
        });

        it('journey list can be filtered', function () {
          cy.get('#departureId').select(2);
          cy.get('#departureDate').type('2023-01-14T14:50');
          cy.get('#returnId').select(1);
          cy.get('#returnDate').type('2023-01-14T15:50');
          cy.get('#distance').clear().type('50');

          cy.get('#save').click();

          cy.contains('Journey created successfully.');
          cy.visit('/journey');
          cy.get('.table tbody tr').should(($tableRow) => {
            expect($tableRow).to.have.length(2);
          });

          cy.get('#filterValue').type('Station 1{enter}');
          cy.get('.table tbody tr').should(($tableRow) => {
            expect($tableRow).to.have.length(1);
          });
        });

        it('journey list can be ordered', function () {
          cy.get('#departureId').select(2);
          cy.get('#departureDate').type('2023-01-14T14:50');
          cy.get('#returnId').select(1);
          cy.get('#returnDate').type('2023-01-14T15:50');
          cy.get('#distance').clear().type('50');

          cy.get('#save').click();

          cy.visit(
            '/journey?page=1&name=&value=&orderBy=departure_station_name&orderDir=asc'
          );

          // cy.get('#departurestation_asc').click();
          // cy.wait(1000);

          cy.get('.table tbody tr')
            .first()
            .get('td')
            .first()
            .should(($tableColumn) => {
              expect($tableColumn).to.contain('Station 1');
            });

          cy.visit(
            '/journey?page=1&name=&value=&orderBy=departure_station_name&orderDir=desc'
          );

          cy.get('.table tbody tr')
            .first()
            .get('td')
            .first()
            .should(($tableColumn) => {
              expect($tableColumn).to.contain('Station 2');
            });
        });

        it('journey detail page can be opened', function () {
          cy.visit('/journey');
          cy.get('.table tbody tr').first().click();

          cy.contains('Station 1');
        });
      });
    });
  });
});
