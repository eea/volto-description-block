/* Edit description block.
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
  const { slate } = config.settings;
  const intl = useIntl();
  const initialValue = data?.value || slate.defaultValue();
  const [value, setValue] = useState(initialValue);
  const text = metadata?.['description'] || properties?.['description'] || '';
  const withBlockProperties = useCallback(
    (editor) => {
      editor.getBlockProps = () => props;
      return editor;
    },
    [props],
  );
  useEffect(() => {
    // Sync the external text into the slate editor state
    if (serializeNodesToText(value) !== text) {
      setValue([
        {
          type: 'p',
          children: [{ text }],
        },
      ]);
    }
    //we want to make a rerender only when description metadata is changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const handleChange = (newValue) => {
    if (JSON.stringify(newValue) !== JSON.stringify(value)) {
      setValue(newValue);
    }
    const plainValue = serializeNodesToText(newValue);

    if (plainValue !== text) {
      onChangeField('description', plainValue);
    }
  };
  useEffect(() => {
    if (data.value !== value) {
      onChangeBlock(block, { ...data, value: value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.value, value]);

  const handleFocus = useCallback(() => {
    if (!selected) {
      onSelectBlock(block);
    }
  }, [onSelectBlock, selected, block]);

  const placeholder =
    data.placeholder || intl.formatMessage(messages['description']);

  return (
    <div className={config.blocks.blocksConfig.description.className}>
      <SlateEditor
        index={index}
        properties={properties}
        extensions={slate.textblockExtensions}
        renderExtensions={[withBlockProperties]}
        onChange={handleChange}
        block={block}
        value={value}
        onFocus={handleFocus}
        onKeyDown={handleKey}
        selected={selected}
        placeholder={placeholder}
        slateSettings={slate}
      />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={schema.title}
          onChangeBlock={onChangeBlock}
          onChangeField={(id, newValue) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: newValue,
            });
          }}
          formData={props.data}
          block={block}
        />
      </SidebarPortal>
    </div>
  );
};

export default connect(() => ({}), { saveSlateBlockSelection })(
  DescriptionBlockEdit,
);
