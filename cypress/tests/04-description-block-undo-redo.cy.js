import { slateAfterEach, slateBeforeEach } from '../support/e2e';
import {
  addDescriptionBlock,
  getDescriptionEditor,
  setDescriptionText,
} from '../support/descriptionBlock';

const DESCRIPTION_EDITOR_SELECTOR = '.documentDescription [contenteditable=true]';
const MAX_HISTORY_STEPS = 3;

const clickHistoryUntilDescriptionEditor = (
  buttonSelector,
  shouldExist,
  remainingSteps = MAX_HISTORY_STEPS,
) => {
  cy.get('body').then(($body) => {
    const editorExists = $body.find(DESCRIPTION_EDITOR_SELECTOR).length > 0;

    if (editorExists === shouldExist) {
      return;
    }

    expect(
      remainingSteps,
      `description editor should ${shouldExist ? 'reappear' : 'disappear'}`,
    ).to.be.greaterThan(0);

    cy.get(buttonSelector).click();
    cy.wait(100);
    clickHistoryUntilDescriptionEditor(
      buttonSelector,
      shouldExist,
      remainingSteps - 1,
    );
  });
};

describe('Description Block Undo Redo', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('undoes and redoes description block insertion', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Description Block Demo');
    cy.get('.documentFirstHeading').contains('Volto Description Block Demo');

    cy.getSlate().click();
    addDescriptionBlock();
    getDescriptionEditor().should('be.visible');

    clickHistoryUntilDescriptionEditor('.toolbar-bottom .button.undo', false);
    cy.get('body').find(DESCRIPTION_EDITOR_SELECTOR).should('have.length', 0);

    clickHistoryUntilDescriptionEditor('.toolbar-bottom .button.redo', true);
    getDescriptionEditor().should('be.visible');

    setDescriptionText('abc');
    getDescriptionEditor().should('contain.text', 'abc');

    cy.get('#toolbar-save').click();
    cy.get('.documentDescription').contains('abc');
  });

  it('restores metadata-backed description text after undo and redo', () => {
    cy.createContent({
      contentType: 'Document',
      contentId: 'page-2',
      contentTitle: 'Page 2',
      path: 'cypress/my-page',
      description: 'Summary survives redo',
    });
    cy.visit('cypress/my-page/page-2/edit');
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + '/cypress/my-page/page-2/edit',
    );

    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Description Block Metadata Redo');
    cy.get('.documentFirstHeading').contains(
      'Volto Description Block Metadata Redo',
    );

    cy.getSlate().click();
    addDescriptionBlock();
    getDescriptionEditor().should('contain.text', 'Summary survives redo');

    clickHistoryUntilDescriptionEditor('.toolbar-bottom .button.undo', false);
    cy.get('body').find(DESCRIPTION_EDITOR_SELECTOR).should('have.length', 0);

    clickHistoryUntilDescriptionEditor('.toolbar-bottom .button.redo', true);
    getDescriptionEditor().should('contain.text', 'Summary survives redo');

    cy.get('#toolbar-save').click();
    cy.get('.documentDescription').contains('Summary survives redo');
  });
});
