import installCustomDescription from '@eeacms/volto-description-block/DescriptionBlock';
import DescriptionWidget from '@eeacms/volto-description-block/DescriptionBlock/DescriptionWidget';

const applyConfig = (config) => {
  // Custom Description widget
  config.widgets.id.description = DescriptionWidget;

  // Custom Description block
  return installCustomDescription(config);
};

export default applyConfig;
