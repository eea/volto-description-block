/**
 * TextareaWidget component.
 * @module components/manage/Widgets/TextareaWidget
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label, TextArea } from 'semantic-ui-react';

import { injectIntl } from 'react-intl';
import config from '@plone/volto/registry';
import { FormFieldWrapper } from '@plone/volto/components';

/**
 * Get default widget
 * @method getViewDefault
 * @returns {string} Widget component.
 */
const getWidgetDefault = () => config.widgets.default;

/**
 * Get widget by factory attribute
 * @method getWidgetByFactory
 * @param {string} id Id
 * @returns {string} Widget component.
 */
const getWidgetByFactory = (factory) =>
  config.widgets.factory?.[factory] || null;

/**
 * Get widget by field's `widget` attribute
 * @method getWidgetByName
 * @param {string} widget Widget
 * @returns {string} Widget component.
 */
const getWidgetByName = (widget) =>
  typeof widget === 'string'
    ? config.widgets.widget[widget] || getWidgetDefault()
    : null;

/**
 * Get widget by tagged values
 * @param {object} widgetOptions
 * @returns {string} Widget component.
 *

directives.widget(
    'fieldname',
    frontendOptions={
        "widget": 'specialwidget',
        "version": 'extra'
    })

 */
const getWidgetFromTaggedValues = (widgetOptions) =>
  typeof widgetOptions?.frontendOptions?.widget === 'string'
    ? config.widgets.widget[widgetOptions.frontendOptions.widget]
    : null;

/**
 * Get widget by field's `vocabulary` attribute
 * @method getWidgetByVocabulary
 * @param {string} vocabulary Widget
 * @returns {string} Widget component.
 */
const getWidgetByVocabulary = (vocabulary) =>
  vocabulary && vocabulary['@id']
    ? config.widgets.vocabulary[
        vocabulary['@id'].replace(/^.*\/@vocabularies\//, '')
      ]
    : null;

/**
 * Get widget by field's hints `vocabulary` attribute in widgetOptions
 * @method getWidgetByVocabularyFromHint
 * @param {string} props Widget props
 * @returns {string} Widget component.
 */
const getWidgetByVocabularyFromHint = (props) =>
  props.widgetOptions && props.widgetOptions.vocabulary
    ? config.widgets.vocabulary[
        props.widgetOptions.vocabulary['@id'].replace(
          /^.*\/@vocabularies\//,
          '',
        )
      ]
    : null;

/**
 * Get widget by field's `choices` attribute
 * @method getWidgetByChoices
 * @param {string} choices Widget
 * @returns {string} Widget component.
 */
const getWidgetByChoices = (props) => {
  if (props.choices) {
    return config.widgets.choices;
  }

  if (props.vocabulary) {
    // If vocabulary exists, then it means it's a choice field in disguise with
    // no widget specified that probably contains a string then we force it
    // to be a select widget instead
    return config.widgets.choices;
  }

  return null;
};

/**
 * Get widget by field's `type` attribute
 * @method getWidgetByType
 * @param {string} type Type
 * @returns {string} Widget component.
 */
const getWidgetByType = (type) => config.widgets.type[type] || null;

const hasDescriptionBlock = (blocks = {}) => {
  for (let id in blocks) {
    if (blocks[id]['@type'] === 'description') {
      return true;
    }
    if (blocks[id].blocks && hasDescriptionBlock(blocks[id].blocks)) {
      return true;
    }
    if (
      blocks[id].data?.blocks &&
      hasDescriptionBlock(blocks[id].data.blocks)
    ) {
      return true;
    }
  }
  return false;
};

/**
 * TextareaWidget, a widget for multiple lines text
 *
 * To use it, in schema properties, declare a field like:
 *
 * ```jsx
 * {
 *  title: "Text",
 *  widget: 'textarea',
 * }
 * ```
 */
const TextareaWidget = (props) => {
  const Widget =
    getWidgetFromTaggedValues(props.widgetOptions) ||
    getWidgetByName(props.widget) ||
    getWidgetByChoices(props) ||
    getWidgetByVocabulary(props.vocabulary) ||
    getWidgetByVocabularyFromHint(props) ||
    getWidgetByFactory(props.factory) ||
    getWidgetByType(props.type) ||
    getWidgetDefault();

  const { id, maxLength, value, onChange, placeholder, formData = {} } = props;
  const [lengthError, setlengthError] = useState('');

  const onhandleChange = (id, value) => {
    if (maxLength && value?.length) {
      let remlength = maxLength - value.length;
      if (remlength < 0) {
        setlengthError(`You have exceed word limit by ${Math.abs(remlength)}`);
      } else {
        setlengthError('');
      }
    }
    onChange(id, value);
  };

  return props.behavior ? (
    <FormFieldWrapper {...props} className="textarea">
      <TextArea
        id={`field-${id}`}
        name={id}
        value={value || ''}
        disabled={props.isDisabled || hasDescriptionBlock(formData.blocks)}
        placeholder={placeholder}
        onChange={({ target }) =>
          onhandleChange(id, target.value === '' ? undefined : target.value)
        }
      />
      {lengthError.length > 0 && (
        <Label key={lengthError} basic color="red" pointing>
          {lengthError}
        </Label>
      )}
    </FormFieldWrapper>
  ) : (
    <Widget {...props} />
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
TextareaWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  wrapped: PropTypes.bool,
  placeholder: PropTypes.string,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
TextareaWidget.defaultProps = {
  description: null,
  maxLength: null,
  required: false,
  error: [],
  value: null,
  onChange: null,
  onEdit: null,
  onDelete: null,
};

export default injectIntl(TextareaWidget);
