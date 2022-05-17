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
  config.settings.blocksWithFootnotes = [
    ...(config.settings.blocksWithFootnotes || []),
    'description',
  ];

  return config;
};
