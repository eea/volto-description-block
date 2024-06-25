/* Edit description block.
 * @module volto-slate/blocks/Description/DescriptionBlockEdit
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import config from '@plone/volto/registry';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
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
  const { slate } = config.settings;
  const initialValue = data?.value || slate.defaultValue();
  const text = metadata?.['description'] || properties?.['description'] || '';

  const plainValue = serializeNodesToText(initialValue);
  useEffect(() => {
    if (plainValue !== text) {
      onChangeField('description', plainValue);
    }
  }, [plainValue, text, onChangeField]);

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
