import fs from 'fs';
import yaml from 'js-yaml';

module.exports = {

  /**
   * Gets the current environment based on NODE_ENV var, defaults to production
   *
   * @return {oject} Environment
   */

  getEnv() {
    const env = {
      name: process.env.NODE_ENV || 'development'
    };

    return env;
  },

  /**
   * Return selected environment config
   *
   * @returns {object} Config
   */
  getConfig() {
    const env = module.exports.getEnv(); //{name: 'development'}; //module.exports.getEnv();
    const config = yaml.safeLoad(
      fs.readFileSync(`${__dirname}/../config.yml`, 'utf-8')
    );

    return config[env.name] || {};
  }
}
