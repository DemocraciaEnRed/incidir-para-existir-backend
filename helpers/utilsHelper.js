const models = require('../models');

exports.getConfigs = async (keys) => {
  try {
    const configs = await models.Config.findAll({
      where: keys ? { key: keys } : null,
    });

    // for every config, check the type and parse the value
    configs.forEach(config => {
      switch (config.type) {
        case 'string':
          config.value = config.value;
          break;
        case 'number':
          config.value = parseInt(config.value, 10);
          break;
        case 'boolean':
          config.value = config.value === 'true';
          break;
        case 'json':
          config.value = JSON.parse(config.value);
          break;
        default:
          config.value = config.value;
          break;
      }
    });

    const formattedConfigs = {};
    configs.forEach(config => {
      formattedConfigs[config.key] = config.value;
    });

    return formattedConfigs;
  } catch (error) {
    throw error;
  }
}

exports.saveConfig = async (key, value) => {
  try {
    const config = await models.Config.findOne({
      where: { key: key }
    });

    if (!config) {
      throw new Error('Config not found');
    }

    // make sure to save the value as a string
    config.value = value.toString();
    await config.save();

    return config;
  } catch (error) {
    throw error;
  }
}
