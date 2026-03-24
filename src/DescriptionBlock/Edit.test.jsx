import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createParagraph } from '@plone/volto-slate/utils';
import { DescriptionBlockEdit } from './Edit';

jest.mock('@plone/volto-slate/utils', () => ({
  __esModule: true,
  createParagraph: (text) => ({
    type: 'p',
    children: [{ text }],
  }),
}));

jest.mock('@plone/volto/registry', () => ({
  __esModule: true,
  default: {
    blocks: {
      blocksConfig: {
        description: {
          className: 'documentDescription',
        },
      },
    },
  },
}));

jest.mock('@plone/volto/components', () => ({
  __esModule: true,
  SidebarPortal: ({ children }) => <div data-testid="sidebar">{children}</div>,
  BlockDataForm: () => <div data-testid="block-data-form" />,
}));

jest.mock('./DetachedTextBlockEditor', () => ({
  __esModule: true,
  DetachedTextBlockEditor: ({ handleChange }) => (
    <button
      type="button"
      onClick={() =>
        handleChange({
          value: [
            {
              type: 'p',
              children: [{ text: 'Typed description' }],
            },
          ],
        })
      }
    >
      change description
    </button>
  ),
}));

describe('DescriptionBlockEdit', () => {
  const makeProps = (overrides = {}) => ({
    selected: true,
    block: 'description-block',
    properties: {},
    metadata: {},
    data: {},
    onChangeField: jest.fn(),
    onChangeBlock: jest.fn(),
    ...overrides,
  });

  it('initializes the block value from metadata once', () => {
    const props = makeProps({
      metadata: { description: 'Existing description' },
    });

    render(<DescriptionBlockEdit {...props} />);

    expect(props.onChangeBlock).toHaveBeenCalledTimes(1);
    expect(props.onChangeBlock).toHaveBeenCalledWith('description-block', {
      plaintext: 'Existing description',
      value: [createParagraph('Existing description')],
    });
  });

  it('does not reinitialize when block text already matches metadata', () => {
    const value = [createParagraph('Existing description')];
    const props = makeProps({
      metadata: { description: 'Existing description' },
      data: {
        plaintext: 'Existing description',
        value,
      },
    });

    render(<DescriptionBlockEdit {...props} />);

    expect(props.onChangeBlock).not.toHaveBeenCalled();
  });

  it('updates the metadata description when the editor value changes', () => {
    const value = [createParagraph('Existing description')];
    const props = makeProps({
      metadata: { description: 'Existing description' },
      data: {
        plaintext: 'Existing description',
        value,
      },
    });

    render(<DescriptionBlockEdit {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'change description' }));

    expect(props.onChangeField).toHaveBeenCalledWith(
      'description',
      'Typed description',
    );
  });

  it('does not overwrite a newer block value while metadata is catching up', () => {
    const props = makeProps({
      metadata: { description: 'Typed descriptio' },
      data: {
        plaintext: 'Typed descriptio',
        value: [createParagraph('Typed descriptio')],
      },
    });

    const { rerender } = render(<DescriptionBlockEdit {...props} />);
    props.onChangeBlock.mockClear();

    rerender(
      <DescriptionBlockEdit
        {...props}
        data={{
          plaintext: 'Typed description',
          value: [createParagraph('Typed description')],
        }}
      />,
    );

    expect(props.onChangeBlock).not.toHaveBeenCalled();
  });
});
