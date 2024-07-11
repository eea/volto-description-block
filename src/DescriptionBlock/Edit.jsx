/* Edit description block.
 * @module volto-slate/blocks/Description/DescriptionBlockEdit
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import config from '@plone/volto/registry';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import { createParagraph } from '@plone/volto-slate/utils';
import { saveSlateBlockSelection } from '@plone/volto-slate/actions';
import { serializeNodesToText } from '@plone/volto-slate/editor/render';
import TextBlockEdit from '@plone/volto-slate/blocks/Text/TextBlockEdit';
import { handleKey } from '@plone/volto-slate/blocks/Text/keyboard';
import schema from './schema';

export const DescriptionBlockEdit = (props) => {
  const {
    selected,
    index,
    block,
    properties,
    metadata,
    data,
    onChangeField,
    onChangeBlock,
    onAddBlock,
    onSelectBlock,
  } = props;
  const text = metadata?.['description'] || properties?.['description'] || '';
  const plainValue = data?.value ? serializeNodesToText(data.value) : null;

  const onKeyDown = ({ editor, event }) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (data.disableNewBlocks) return;
      onSelectBlock(onAddBlock(config.settings.defaultBlockType, index + 1));
      return;
    }
    handleKey(editor, event);
  };

  useEffect(() => {
    if (!isNil(plainValue) && plainValue !== text) {
      onChangeField('description', plainValue);
    }
    if (isNil(plainValue) && !isNil(text)) {
      onChangeBlock(block, {
        ...data,
        value: [createParagraph(text)],
        plaintext: text,
      });
    }
  }, [data, plainValue, text, onChangeField, onChangeBlock, block]);

  return (
    <div className={config.blocks.blocksConfig.description.className}>
      <TextBlockEdit {...props} onKeyDown={onKeyDown} multiBlocks={false} />
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
