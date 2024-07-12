import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Enter in Block', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Enter Block Demo');
    cy.get('.documentFirstHeading').contains('Volto Enter Block Demo');

    cy.getSlate().click();

    // Add description block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'description',
    );
    cy.get('.button.description').click();

    // Add text with enter key
    cy.get('.documentDescription div[role="textbox"]')
      .click()
      .type('First line{enter}Second line{enter}Third line{enter}');

    // Save
    cy.get('#toolbar-save').click();

    // Verify lines
    cy.get('.documentDescription').contains('First line');
    cy.get('.documentDescription').contains('Second line');
    cy.get('.documentDescription').contains('Third line');
  });

  it('Insert Text in the Middle', () => {
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
      .type('lorem ipsum dolor sit amet. I will insert in the middle.');

    cy.get('#toolbar-save').click();
    cy.get('.edit').click();

    cy.get('.documentDescription div[role="textbox"]')
      .click()
      .setSelection('insert')
      .type('middle');

    cy.get('#toolbar-save').click();

    // The page view should contain our changes
    cy.get('.documentDescription').contains('lorem ipsum dolor sit amet');
    cy.get('.documentDescription').contains('I will middle in the middle');
  });

  it('Copy Paste Paragraphs', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Copy Paste Demo');
    cy.get('.documentFirstHeading').contains('Volto Copy Paste Demo');

    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'description',
    );
    cy.get('.button.description').click();
    // Simulate copying paragraphs from an external source
    const paragraphs = 'First paragraph.\nSecond paragraph.';

    // Paste paragraphs
    cy.window().then((win) => {
      const tempInput = win.document.createElement('textarea');
      tempInput.value = paragraphs;
      win.document.body.appendChild(tempInput);
      tempInput.select();
      win.document.execCommand('copy');
      win.document.body.removeChild(tempInput);
    });

    // Paste paragraphs using ctrl+v
    cy.get('.documentDescription div[role="textbox"]').then(($element) => {
      const element = $element[0];
      element.focus();

      // Create a new ClipboardEvent to paste the content
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer(),
      });
      pasteEvent.clipboardData.setData('text/plain', paragraphs);
      element.dispatchEvent(pasteEvent);

      // Insert the text manually as a fallback
      element.innerText = paragraphs;

      // Trigger input event to ensure any listeners are fired
      const inputEvent = new Event('input', { bubbles: true });
      element.dispatchEvent(inputEvent);
    });

    // Save
    cy.get('#toolbar-save').click();

    // Verify paragraphs
    cy.get('.documentDescription').contains('First paragraph.');
    cy.get('.documentDescription').contains('Second paragraph.');
  });
  it('Subscript, Italic, Bold', () => {
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
      .type('lorem ipsum dolor sit amet. I will insert in the middle.');

    cy.get('#toolbar-save').click();
    cy.get('.edit').click();

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
    cy.get('.documentDescription').find('strong').should('exist');
    cy.get('.documentDescription').find('em').should('exist');
    cy.get('.documentDescription').find('sub').should('exist');
  });
});
