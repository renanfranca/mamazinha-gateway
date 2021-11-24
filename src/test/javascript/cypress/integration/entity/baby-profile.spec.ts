import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('BabyProfile e2e test', () => {
  const babyProfilePageUrl = '/baby-profile';
  const babyProfilePageUrlPattern = new RegExp('/baby-profile(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/baby/api/baby-profiles+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/baby/api/baby-profiles').as('postEntityRequest');
    cy.intercept('DELETE', '/services/baby/api/baby-profiles/*').as('deleteEntityRequest');
  });

  it('should load BabyProfiles', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('baby-profile');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BabyProfile').should('exist');
    cy.url().should('match', babyProfilePageUrlPattern);
  });

  it('should load details BabyProfile page', function () {
    cy.visit(babyProfilePageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('babyProfile');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', babyProfilePageUrlPattern);
  });

  it('should load create BabyProfile page', () => {
    cy.visit(babyProfilePageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BabyProfile');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', babyProfilePageUrlPattern);
  });

  it('should load edit BabyProfile page', function () {
    cy.visit(babyProfilePageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('BabyProfile');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', babyProfilePageUrlPattern);
  });

  it('should create an instance of BabyProfile', () => {
    cy.visit(babyProfilePageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BabyProfile');

    cy.get(`[data-cy="name"]`).type('Bedfordshire').should('have.value', 'Bedfordshire');

    cy.setFieldImageAsBytesOfEntity('picture', 'integration-test.png', 'image/png');

    cy.get(`[data-cy="birthday"]`).type('2021-09-13T13:45').should('have.value', '2021-09-13T13:45');

    cy.get(`[data-cy="sign"]`).type('Consultant Human mobile').should('have.value', 'Consultant Human mobile');

    cy.get(`[data-cy="main"]`).should('not.be.checked');
    cy.get(`[data-cy="main"]`).click().should('be.checked');

    cy.get(`[data-cy="userId"]`).type('bandwidth User-centric').should('have.value', 'bandwidth User-centric');

    // since cypress clicks submit too fast before the blob fields are validated
    cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', babyProfilePageUrlPattern);
  });

  it('should delete last instance of BabyProfile', function () {
    cy.visit(babyProfilePageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('babyProfile').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', babyProfilePageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
