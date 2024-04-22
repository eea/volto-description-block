import Edit from './Edit';
import View from './View';

const applyConfig = (config) => {
  config.blocks.blocksConfig.description = {
    ...config.blocks.blocksConfig.description,
    edit: Edit,
    view: View,
    restricted: false,
    className: 'documentDescription',
  };

  // Footnotes
  config.settings.blocksWithFootnotesSupport = {
    ...(config.settings.blocksWithFootnotesSupport || {}),
    description: ['value'],
  };

  return config;
};

export default applyConfig;
