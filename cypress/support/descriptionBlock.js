export const getDescriptionEditor = () =>
  cy
    .get('.documentDescription [contenteditable=true]', { timeout: 10000 })
    .first();

export const focusDescriptionEditor = () =>
  getDescriptionEditor().should('be.visible').click({ force: true });

export const addDescriptionBlock = () => {
  cy.get('.ui.basic.icon.button.block-add-button').first().click();
  cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
    'description',
  );
  cy.get('.button.description').click({ force: true });
  focusDescriptionEditor();
};

export const setDescriptionText = (text) => {
  getDescriptionEditor().then(($element) => {
    const element = $element[0];
    element.focus();

    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });

    pasteEvent.clipboardData.setData('text/plain', text);
    element.dispatchEvent(pasteEvent);
    element.innerText = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

export const insertDescriptionText = (text) => {
  getDescriptionEditor().type(text, {
    delay: 0,
    force: true,
    parseSpecialCharSequences: false,
  });
};

export const typeDescriptionText = (text) => {
  const lines = text.split('\n');

  focusDescriptionEditor();

  lines.forEach((line, index) => {
    if (line) {
      insertDescriptionText(line);
    }

    if (index < lines.length - 1) {
      getDescriptionEditor().type('{enter}', { delay: 0, force: true });
    }
  });
};

export const replaceDescriptionSelection = (text) => {
  cy.document().then((document) => {
    document.execCommand('insertText', false, text);
  });
};
