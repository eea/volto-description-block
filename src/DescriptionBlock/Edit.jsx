/* Edit description block.
 * @module volto-slate/blocks/Description/DescriptionBlockEdit
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import config from '@plone/volto/registry';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import { createParagraph } from '@plone/volto-slate/utils';
import { saveSlateBlockSelection } from '@plone/volto-slate/actions';
import { DetachedTextBlockEditor } from '@plone/volto-slate/blocks/Text/DetachedTextBlockEditor';
import schema from './schema';

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
  const plainValue = useMemo(() => data?.plaintext || null, [data?.plaintext]);
  const prevText = usePrevious(text);

  useEffect(() => {
    if (!isNil(plainValue) && plainValue !== text && prevText === text) {
      onChangeField('description', plainValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChangeField, text, plainValue]);

  useEffect(() => {
    if (isNil(plainValue) && !isNil(text)) {
      onChangeBlock(block, {
        ...data,
        value: [createParagraph(text)],
        plaintext: text,
      });
    }
  }, [data, plainValue, onChangeBlock, block, text]);

  return (
    <div className={config.blocks.blocksConfig.description.className}>
      <DetachedTextBlockEditor {...props} />
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
