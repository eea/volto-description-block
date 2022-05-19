import Edit from './Edit';
import View from './View';

export default (config) => {
  config.blocks.blocksConfig.description = {
    ...config.blocks.blocksConfig.description,
    edit: Edit,
    view: View,
    sidebarTab: 0,
  };

  // Footnotes
  config.settings.blocksWithFootnotesSupport = {
    ...(config.settings.blocksWithFootnotesSupport || {}),
    description: ['value'],
  };

  return config;
};
