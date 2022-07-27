const { mergeConfig } = require('vite');

module.exports = {
  core: {
    builder: "@storybook/builder-vite"
  },
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],

  async viteFinal(config, { configType }) {
    // return the customized config
    return mergeConfig(config, {
      // customize the Vite config here
      base: configType === 'PRODUCTION' ?  '/react-dismissable-layers/' : config.base,
    });
  },
}
