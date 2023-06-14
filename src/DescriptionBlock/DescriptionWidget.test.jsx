import { render, fireEvent } from '@testing-library/react';
import config from '@plone/volto/registry';
import { Provider } from 'react-intl-redux';
import configureStore from 'redux-mock-store';
import TextareaWidget from './DescriptionWidget';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore();
const store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
  },
});

const mockOnChange = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe('TextareaWidget', () => {
  it('renders without crashing default', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: {},
      type: {},
      widget: {},
      factory: {},
    };
    const { getByRole } = render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
        />
      </Provider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders an error message when maxLength is exceeded and formData has blocks with blocks', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: {},
      type: {},
      widget: {},
      factory: {},
    };

    const { getByText, getByRole } = render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          maxLength={5}
          behavior={true}
          formData={{
            blocks: {
              'test-field': { '@type': 'boolean' },
              'test-field-2': {
                '@type': 'boolean',
                blocks: { 'test-field-3': { '@type': 'description' } },
              },
            },
          }}
        />
      </Provider>,
    );

    const textarea = getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test' } });
    fireEvent.change(textarea, { target: { value: 'Exceeding the limit' } });
    expect(getByText(/You have exceed word limit/)).toBeInTheDocument();
  });

  it('renders an error message when maxLength is exceeded and formData has blocks with data', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: {},
      type: {},
      widget: {},
      factory: {},
    };

    const { getByText, getByRole } = render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          maxLength={5}
          behavior={true}
          formData={{
            blocks: {
              'test-field': { '@type': 'boolean' },
              'test-field-2': {
                '@type': 'boolean',
                data: {
                  blocks: { 'test-field-3': { '@type': 'description' } },
                },
              },
            },
          }}
        />
      </Provider>,
    );

    const textarea = getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test' } });
    fireEvent.change(textarea, { target: { value: 'Exceeding the limit' } });
    expect(getByText(/You have exceed word limit/)).toBeInTheDocument();
  });

  it('renders an error message when maxLength is exceeded and formData is empty', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: {},
      type: {},
      widget: {},
      factory: {},
    };
    const { getByText, getByRole } = render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          maxLength={5}
          behavior={true}
          formData={{}}
        />
      </Provider>,
    );

    const textarea = getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test' } });
    fireEvent.change(textarea, { target: { value: 'Exceeding the limit' } });
    expect(getByText(/You have exceed word limit/)).toBeInTheDocument();
  });

  it('renders without crashing and calls getWidgetByName', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: {},
      type: {},
      widget: { textarea: 'textarea' },
      factory: {},
    };
    const { getByRole } = render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          widget={'textarea'}
        />
      </Provider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders without crashing and calls getWidgetByName and getWidgetDefault', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: {},
      type: {},
      widget: { text: 'textarea' },
      factory: {},
    };
    const { getByRole } = render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          widget={'textarea'}
        />
      </Provider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders without crashing and calls getWidgetFromTaggedValues', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: {},
      type: {},
      widget: { textarea: 'textarea' },
      factory: {},
    };
    const { getByRole } = render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          widgetOptions={{ frontendOptions: { widget: 'textarea' } }}
        />
      </Provider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('renders without crashing and calls getWidgetByChoices', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: {},
      type: {},
      widget: { textarea: 'textarea' },
      factory: {},
    };
    render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          choices={'textarea'}
        />
      </Provider>,
    );
  });

  it('renders without crashing and calls getWidgetByVocabulary', () => {
    config.widgets = {
      default: 'textarea',
      choices: '',
      vocabulary: { textarea: 'textarea' },
      type: {},
      widget: { textarea: 'textarea' },
      factory: {},
    };
    render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          vocabulary={{
            '@id': 'http://localhost:3000/@vocabularies/textarea',
          }}
        />
      </Provider>,
    );
  });

  it('renders without crashing and calls getWidgetByVocabularyFromHint', () => {
    config.widgets = {
      default: 'textarea',
      choices: 'div',
      vocabulary: { textarea: 'textarea' },
      type: {},
      widget: { textarea: 'textarea' },
      factory: {},
    };
    const { getByRole } = render(
      <Provider store={store}>
        <TextareaWidget
          onChange={mockOnChange}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          id="test-field"
          title="Test field"
          widgetOptions={{
            vocabulary: {
              '@id': 'http://localhost:3000/@vocabularies/textarea',
            },
          }}
        />
      </Provider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
  });
});
