import installCallout from 'volto-slate/editor/plugins/Callout';
import installCustomDescription from '@eeacms/volto-description-block/DescriptionBlock';
import DescriptionWidget from '@eeacms/volto-description-block/DescriptionBlock/DescriptionWidget';

const applyConfig = (config) => {
  // Custom widget for description
  config.widgets.id.description = DescriptionWidget;

  return [installCallout, installCustomDescription].reduce(
    (acc, apply) => apply(acc),
    config,
  );
};

export default applyConfig;
