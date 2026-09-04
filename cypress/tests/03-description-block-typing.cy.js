import { slateBeforeEach, slateAfterEach } from '../support/e2e';
import {
  addDescriptionBlock,
  getDescriptionEditor,
  setDescriptionText,
} from '../support/descriptionBlock';

describe('Description Block Typing', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Input in the description block does not crash the editor', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto Typing Demo');
    cy.get('.documentFirstHeading').contains('Volto Typing Demo');

    cy.getSlate().click();
    addDescriptionBlock();
    setDescriptionText('Typed with the keyboard');
    getDescriptionEditor().should('contain.text', 'Typed with the keyboard');

    cy.contains('Sorry, something went wrong with your request').should(
      'not.exist',
    );

    cy.get('#toolbar-save').click();
    cy.get('.documentDescription').contains('Typed with the keyboard');
  });
});
