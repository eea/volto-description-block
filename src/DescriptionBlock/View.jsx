/**
 * View title block.
 * @module components/manage/Blocks/Title/View
 */

import { useMemo } from 'react';
import { isArray } from 'lodash';
import config from '@plone/volto/registry';
import {
  serializeNodes,
  serializeNodesToText,
} from '@plone/volto-slate/editor/render';

export const serializeText = (text) => {
  return isArray(text) ? serializeNodes(text) : text;
};

const View = (props) => {
  const { data } = props;
  const metadata = props.metadata || props.properties;

  const text = metadata?.['description'] || '';
  const blockText = data?.value || config.settings.slate.defaultValue();
  const plainBlockText = useMemo(() => serializeNodesToText(blockText), [
    blockText,
  ]);

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

  return (
    <div className={config.blocks.blocksConfig.description.className}>
      {serializeText(value)}
    </div>
  );
};

export default View;
