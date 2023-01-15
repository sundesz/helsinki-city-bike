/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('stationTestData', (num = 1) => {
  const newStation = {
    nameFi: `Station ${num}`,
    addressFi: `Address ${num}`,
    cityFi: `City ${num}`,
    operator: `Operator ${num}`,
    capacity: '50',
    posX: 22.84055 + num,
    posY: 62.1658 + num,
  };

  cy.request('POST', 'http://localhost:8080/api/v1/station', newStation);
});

Cypress.Commands.add('journeyTestData', () => {
  const newJourney = {
    departureStationId: 1,
    departureDateTime: '2023-01-14T13:50',
    returnStationId: 2,
    returnDateTime: '2023-01-14T14:50',
    distanceCovered: 500,
  };

  cy.request('POST', 'http://localhost:8080/api/v1/journey', newJourney);
});
