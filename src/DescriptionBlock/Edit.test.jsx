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

jest.mock('@plone/volto/components/manage/Sidebar/SidebarPortal', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="sidebar">{children}</div>,
}));

jest.mock('@plone/volto/components/manage/Form/BlockDataForm', () => ({
  __esModule: true,
  default: () => <div data-testid="block-data-form" />,
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

  it('initializes the block value when metadata arrives after mount', () => {
    const props = makeProps();
    const { rerender } = render(<DescriptionBlockEdit {...props} />);

    expect(props.onChangeBlock).not.toHaveBeenCalled();

    rerender(
      <DescriptionBlockEdit
        {...props}
        metadata={{ description: 'Existing description' }}
      />,
    );

    expect(props.onChangeBlock).toHaveBeenCalledTimes(1);
    expect(props.onChangeBlock).toHaveBeenCalledWith('description-block', {
      plaintext: 'Existing description',
      value: [createParagraph('Existing description')],
    });
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

  it('does not re-seed the block when user clears text and properties oscillate', () => {
    // Simulate: block has text, user deletes all, then properties.description
    // bounces back to the original value (Volto 18 form state oscillation).
    const props = makeProps({
      properties: { description: 'Hello' },
      data: {
        plaintext: 'Hello',
        value: [createParagraph('Hello')],
      },
    });

    const { rerender } = render(<DescriptionBlockEdit {...props} />);
    props.onChangeBlock.mockClear();

    // User deletes all text: plaintext becomes '' (empty string, not null)
    rerender(
      <DescriptionBlockEdit
        {...props}
        properties={{ description: '' }}
        data={{
          plaintext: '',
          value: [{ type: 'p', children: [{ text: '' }] }],
        }}
      />,
    );

    expect(props.onChangeBlock).not.toHaveBeenCalled();

    // properties.description oscillates back to the original value
    rerender(
      <DescriptionBlockEdit
        {...props}
        properties={{ description: 'Hello' }}
        data={{
          plaintext: '',
          value: [{ type: 'p', children: [{ text: '' }] }],
        }}
      />,
    );

    // Must NOT re-seed — plaintext is '' (block was populated), not null
    expect(props.onChangeBlock).not.toHaveBeenCalled();
  });
});
