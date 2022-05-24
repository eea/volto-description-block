/**
 * Edit description block.
 * @module volto-slate/blocks/Description/DescriptionBlockEdit
 */

import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import config from '@plone/volto/registry';
import { SidebarPortal } from '@plone/volto/components';
import { BlockDataForm } from '@plone/volto/components';
import { handleKey } from 'volto-slate/blocks/Text/keyboard';
import { saveSlateBlockSelection } from 'volto-slate/actions';
import SlateEditor from 'volto-slate/editor/SlateEditor';
import { serializeNodesToText } from 'volto-slate/editor/render';
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
    onChangeBlock,
    onSelectBlock,
    block,
    properties,
    metadata,
    data,
  } = props;
  const intl = useIntl();

  const text = metadata?.['description'] || properties?.['description'] || '';
  const blockText = data?.value || config.settings.slate.defaultValue();
  const plainBlockText = useMemo(() => serializeNodesToText(blockText), [
    blockText,
  ]);

  const withBlockProperties = useCallback(
    (editor) => {
      editor.getBlockProps = () => props;
      return editor;
    },
    [props],
  );

  const handleChange = useCallback(
    (value) => {
      const plainValue = serializeNodesToText(value);
      onChangeBlock(block, {
        ...data,
        value: value,
      });
      if (plainValue !== text) {
        onChangeField('description', plainValue);
      }
    },
    [block, data, text, onChangeField, onChangeBlock],
  );

  const value = useMemo(() => {
    if (plainBlockText !== text) {
      return [
        {
          type: 'p',
          children: [{ text }],
        },
      ];
    }
    return blockText;
  }, [text, blockText, plainBlockText]);

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

  return (
    <div className={config.blocks.blocksConfig.description.className}>
      <SlateEditor
        index={index}
        properties={properties}
        extensions={slate.textblockExtensions}
        renderExtensions={[withBlockProperties]}
        value={value}
        onChange={handleChange}
        block={block}
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
