import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Description Block Demo');
    cy.get('.documentFirstHeading').contains('Volto Description Block Demo');

    cy.getSlate().click();

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.listing')
      .contains('Listing')
      .click({ force: true });

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    cy.contains('Volto Description Block Demo');
    cy.get('.block.listing');

    // Add a page to our site at the path cypress/my-page so it can be removed at the end of the test
    cy.createContent({
      contentType: 'Document',
      contentId: 'page-1',
      contentTitle: 'Page 1',
      path: 'cypress/my-page',
    });

    // Visit the new page
    cy.visit('cypress/my-page/page-1');
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page/page-1');

    cy.get('.edit').click();

    // Add a description block
    cy.getSlate().click();
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'description',
    );
    cy.get('.button.description').click();

    // Add some text
    cy.get('.documentDescription div[role="textbox"]')
      .click()
      .type('lorem ipsum dolor sit amet. I will insert in the middle');

    cy.get('#toolbar-save').click();
    cy.wait(5000);
    cy.get('.edit').click();

    cy.get('.documentDescription [contenteditable=true]')
      .setSelection('insert')
      .type('middle');
    // Select a part of the text and make it bold
    cy.get('.documentDescription [contenteditable=true]').setSelection('lorem');
    cy.get('.ui.buttons .button-wrapper a[title="Bold"]').click({
      force: true,
    });

    // Select another part of the text and make it italic
    cy.get('.documentDescription div[role="textbox"]').click();
    cy.get('.documentDescription [contenteditable=true]').setSelection('ipsum');
    cy.get('.ui.buttons .button-wrapper a[title="Italic"]').click({
      force: true,
    });

    // Select another part of the text and make it a subscript
    cy.get('.documentDescription div[role="textbox"]').click();
    cy.get('.documentDescription [contenteditable=true]').setSelection(
      'dolor sit amet',
    );
    cy.get('.ui.buttons .button-wrapper a[title="Subscript"]').click({
      force: true,
    });

    cy.contains('lorem ipsum dolor sit amet');
    cy.get('#toolbar-save').click();

    // The page view should contain our changes
    cy.get('.documentDescription').contains('lorem ipsum dolor sit amet');
    cy.get('.documentDescription').contains('I will middle in the middle');
    cy.get('.documentDescription').find('strong').should('exist');
    cy.get('.documentDescription').find('sub').should('exist');
    cy.visit('/cypress/my-page');
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');
    cy.contains('lorem ipsum dolor sit amet');
  });
});
