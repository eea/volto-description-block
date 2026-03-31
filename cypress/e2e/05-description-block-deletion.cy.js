import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  addDescriptionBlock,
  getDescriptionEditor,
} from '../support/descriptionBlock';

describe('Description Block Text Deletion', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('allows deleting all text and typing new text', () => {
    cy.createContent({
      contentType: 'Document',
      contentId: 'deletion-test-1',
      contentTitle: 'Deletion Test 1',
      path: 'cypress/my-page',
      description: 'z',
    });
    cy.visit('cypress/my-page/deletion-test-1/edit');
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + '/cypress/my-page/deletion-test-1/edit',
    );

    cy.getSlate().click();
    addDescriptionBlock();
    getDescriptionEditor().should('contain.text', 'z');

    // Delete the single character
    getDescriptionEditor().type('{selectall}{backspace}');
    getDescriptionEditor().should('not.contain.text', 'z');

    // Type new text to confirm the editor is still functional
    getDescriptionEditor().typeInSlate('Recovered');
    getDescriptionEditor().should('contain.text', 'Recovered');

    cy.get('#toolbar-save').click();
    cy.get('.documentDescription').contains('Recovered');
  });

  it('allows selecting all metadata-backed text and deleting it', () => {
    cy.createContent({
      contentType: 'Document',
      contentId: 'deletion-test-2',
      contentTitle: 'Deletion Test 2',
      path: 'cypress/my-page',
      description: 'Original summary',
    });
    cy.visit('cypress/my-page/deletion-test-2/edit');
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + '/cypress/my-page/deletion-test-2/edit',
    );

    cy.getSlate().click();
    addDescriptionBlock();
    getDescriptionEditor().should('contain.text', 'Original summary');

    // Select all text and delete
    getDescriptionEditor().type('{selectall}{backspace}');
    getDescriptionEditor().should('not.contain.text', 'Original summary');

    // Type replacement text to confirm editor still works
    getDescriptionEditor().typeInSlate('Replaced');
    getDescriptionEditor().should('contain.text', 'Replaced');

    cy.get('#toolbar-save').click();
    cy.get('.documentDescription').contains('Replaced');
  });
});
