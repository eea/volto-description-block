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
import schema from './schema';
import TextBlockEdit from '@plone/volto-slate/blocks/Text/TextBlockEdit';

export const DescriptionBlockEdit = (props) => {
  const {
    selected,
    onChangeField,
    block,
    properties,
    metadata,
    onChangeBlock,
    data,
  } = props;
  const text = metadata?.['description'] || properties?.['description'] || '';
  const plainValue = data?.value ? serializeNodesToText(data.value) : null;

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
  }, [plainValue, text, onChangeField, onChangeBlock, block]);

  return (
    <div className={config.blocks.blocksConfig.description.className}>
      <TextBlockEdit {...props} />
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
