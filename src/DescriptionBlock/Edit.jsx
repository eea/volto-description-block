/**
 * Edit description block.
 * @module volto-slate/blocks/Description/DescriptionBlockEdit
 */

import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import config from '@plone/volto/registry';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import { handleKey } from '@plone/volto-slate/blocks/Text/keyboard';
import { saveSlateBlockSelection } from '@plone/volto-slate/actions';
import SlateEditor from '@plone/volto-slate/editor/SlateEditor';
import { serializeNodesToText } from '@plone/volto-slate/editor/render';
import schema from './schema';

const messages = defineMessages({
  description: {
    id: 'Add a description…',
    defaultMessage: 'Add a description…',
  },
});

export const DescriptionBlockEdit = (props) => {
  const { slate } = config.settings;
  const {
    selected,
    index,
    onChangeField,
    onSelectBlock,
    block,
    properties,
    metadata,
    onChangeBlock,
    data,
  } = props;
  const intl = useIntl();
  const [value, setValue] = useState(
    data?.value || config.settings.slate.defaultValue(),
  );
  const text = metadata?.['description'] || properties?.['description'] || '';

  const withBlockProperties = useCallback(
    (editor) => {
      editor.getBlockProps = () => props;
      return editor;
    },
    [props],
  );

  const handleChange = useCallback(
    (newValue) => {
      const plainValue = serializeNodesToText(newValue);

      if (JSON.stringify(newValue) !== JSON.stringify(value)) {
        const newData = { ...data, value: newValue };

        if (JSON.stringify(newData) !== JSON.stringify(data)) {
          onChangeBlock(block, newData);
        }
        if (plainValue !== text) {
          onChangeField('description', plainValue);
        }
      }
    },
    [value, text, block, data, onChangeField, onChangeBlock],
  );

  const handleFocus = useCallback(() => {
    if (!selected) {
      onSelectBlock(block);
    }
  }, [onSelectBlock, selected, block]);

  if (typeof window.__SERVER__ !== 'undefined' || __SERVER__) {
    return <div />;
  }

  const placeholder =
    data.placeholder || intl.formatMessage(messages['description']);

  useEffect(() => {
    let plainText = serializeNodesToText(value);
    if (plainText !== text) {
      setValue([
        {
          type: 'p',
          children: [{ text }],
        },
      ]);
    }
  }, [data, text, value]);

  return (
    <div className={config.blocks.blocksConfig.description.className}>
      <SlateEditor
        index={index}
        properties={properties}
        extensions={slate.textblockExtensions}
        renderExtensions={[withBlockProperties]}
        onChange={handleChange}
        block={block}
        value={data.value}
        onFocus={handleFocus}
        onKeyDown={handleKey}
        selected={selected}
        placeholder={placeholder}
        slateSettings={slate}
      />
      <SidebarPortal selected={props.selected}>
        <BlockDataForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          formData={props.data}
          block={block}
        />
      </SidebarPortal>
    </div>
  );
};

export default connect(
  () => {
    return {};
  },
  {
    saveSlateBlockSelection,
  },
)(DescriptionBlockEdit);
