import { slateAfterEach, slateBeforeEach } from '../support/e2e';
import {
  addDescriptionBlock,
  getDescriptionEditor,
  setDescriptionText,
} from '../support/descriptionBlock';

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

    cy.get('.toolbar-bottom .button.undo').click();
    cy.get('.documentDescription').should('not.exist');

    cy.get('.toolbar-bottom .button.redo').click();
    getDescriptionEditor().should('be.visible');

    setDescriptionText('abc');
    getDescriptionEditor().should('contain.text', 'abc');

    cy.get('#toolbar-save').click();
    cy.get('.documentDescription').contains('abc');
  });
});
