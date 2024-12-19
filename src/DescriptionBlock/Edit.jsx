/* Edit description block.
 * @module volto-slate/blocks/Description/DescriptionBlockEdit
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import config from '@plone/volto/registry';
import { isEmpty, isNil } from 'lodash';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import {
  createEmptyParagraph,
  createParagraph,
} from '@plone/volto-slate/utils';
import { saveSlateBlockSelection } from '@plone/volto-slate/actions';
import { serializeNodesToText } from '@plone/volto-slate/editor/render';
import schema from './schema';
import { DetachedTextBlockEditor } from './DetachedTextBlockEditor';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const DescriptionBlockEdit = (props) => {
  const {
    selected,
    block,
    properties,
    metadata,
    data,
    onChangeField,
    onChangeBlock,
  } = props;
  const text = useMemo(
    () => metadata?.['description'] || properties?.['description'] || '',
    [metadata, properties],
  );
  const plainText = useMemo(() => data?.plaintext || null, [data.plaintext]);
  const prevText = usePrevious(text);

  useEffect(() => {
    //undo/redo behavior
    if (prevText !== text) {
      onChangeBlock(block, {
        ...data,
        value: data.value || [createEmptyParagraph()],
        plaintext: plainText,
      });
    }
  }, [text, prevText, block, data, onChangeBlock, plainText]);

  useEffect(() => {
    if (isNil(plainText) && !isEmpty(text)) {
      onChangeBlock(block, {
        ...data,
        value: [createParagraph(text)],
        plaintext: text,
      });
    }
  }, [data, plainText, text, onChangeField, onChangeBlock, block]);

  return (
    <div className={config.blocks.blocksConfig.description.className}>
      <DetachedTextBlockEditor
        {...props}
        handleChange={({ value }) => {
          const plainValue = value ? serializeNodesToText(value) : null;
          if (plainValue !== text) {
            onChangeField('description', plainValue);
          }
        }}
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
