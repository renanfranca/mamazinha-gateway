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

describe('BreastFeed e2e test', () => {
  const breastFeedPageUrl = '/breast-feed';
  const breastFeedPageUrlPattern = new RegExp('/breast-feed(\\?.*)?$');
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
    cy.intercept('GET', '/services/baby/api/breast-feeds+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/baby/api/breast-feeds').as('postEntityRequest');
    cy.intercept('DELETE', '/services/baby/api/breast-feeds/*').as('deleteEntityRequest');
  });

  it('should load BreastFeeds', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('breast-feed');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BreastFeed').should('exist');
    cy.url().should('match', breastFeedPageUrlPattern);
  });

  it('should load details BreastFeed page', function () {
    cy.visit(breastFeedPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityDetailsButtonSelector).first().click({ force: true });
    cy.getEntityDetailsHeading('breastFeed');
    cy.get(entityDetailsBackButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', breastFeedPageUrlPattern);
  });

  it('should load create BreastFeed page', () => {
    cy.visit(breastFeedPageUrl);
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BreastFeed');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', breastFeedPageUrlPattern);
  });

  it('should load edit BreastFeed page', function () {
    cy.visit(breastFeedPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        this.skip();
      }
    });
    cy.get(entityEditButtonSelector).first().click({ force: true });
    cy.getEntityCreateUpdateHeading('BreastFeed');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.get(entityCreateCancelButtonSelector).click({ force: true });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', breastFeedPageUrlPattern);
  });

  it('should create an instance of BreastFeed', () => {
    cy.visit(breastFeedPageUrl);
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('BreastFeed');

    cy.get(`[data-cy="start"]`).type('2021-09-13T06:59').should('have.value', '2021-09-13T06:59');

    cy.get(`[data-cy="end"]`).type('2021-09-13T04:43').should('have.value', '2021-09-13T04:43');

    cy.get(`[data-cy="pain"]`).select('DISCOMFORTING');

    cy.setFieldSelectToLastOfEntity('babyProfile');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(201);
    });
    cy.wait('@entitiesRequest').then(({ response }) => {
      expect(response.statusCode).to.equal(200);
    });
    cy.url().should('match', breastFeedPageUrlPattern);
  });

  it('should delete last instance of BreastFeed', function () {
    cy.visit(breastFeedPageUrl);
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', response.body.length);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('breastFeed').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', breastFeedPageUrlPattern);
      } else {
        this.skip();
      }
    });
  });
});
