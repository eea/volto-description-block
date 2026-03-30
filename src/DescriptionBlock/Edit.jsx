/* Edit description block.
 * @module volto-slate/blocks/Description/DescriptionBlockEdit
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import config from '@plone/volto/registry';
import { isEmpty } from 'lodash';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import { createParagraph } from '@plone/volto-slate/utils';
import { saveSlateBlockSelection } from '@plone/volto-slate/actions';
import { serializeNodesToText } from '@plone/volto-slate/editor/render';
import schema from './schema';
import { DetachedTextBlockEditor } from './DetachedTextBlockEditor';

export const DescriptionBlockEdit = (props) => {
  const initialized = useRef(false);
  const {
    selected,
    block,
    properties,
    metadata,
    data,
    onChangeField,
    onChangeBlock,
  } = props;
  const text = metadata?.['description'] ?? properties?.['description'] ?? '';
  const plainText =
    data?.plaintext ?? (data?.value ? serializeNodesToText(data.value) : null);

  useEffect(() => {
    if (!initialized.current && isEmpty(plainText) && !isEmpty(text)) {
      onChangeBlock(block, {
        ...data,
        value: [createParagraph(text)],
        plaintext: text,
      });
    }
    initialized.current = true;
  }, [block, data, onChangeBlock, plainText, text]);

  const handleChange = useCallback(
    ({ value }) => {
      const plainValue = value ? serializeNodesToText(value) : null;
      if (plainValue !== text) {
        onChangeField('description', plainValue);
      }
    },
    [onChangeField, text],
  );
  return (
    <div className={config.blocks.blocksConfig.description.className}>
      <DetachedTextBlockEditor {...props} handleChange={handleChange} />
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
