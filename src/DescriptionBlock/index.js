import Edit from '@plone/volto/components/manage/Blocks/Description/Edit';
import View from './View';

const applyConfig = (config) => {
  config.blocks.blocksConfig.description = {
    ...config.blocks.blocksConfig.description,
    edit: (props) => (
      <div className={config.blocks.blocksConfig.description.className}>
        <Edit {...props} />
      </div>
    ),
    view: View,
    restricted: false,
    className: 'documentDescription',
    blockHasOwnFocusManagement: false,
  };

  // Footnotes
  config.settings.blocksWithFootnotesSupport = {
    ...(config.settings.blocksWithFootnotesSupport || {}),
    description: ['value'],
  };

  return config;
};

export default applyConfig;
