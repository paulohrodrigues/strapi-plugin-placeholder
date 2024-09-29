import { PLUGIN_ID } from '../pluginId';
import type { Core } from '@strapi/strapi';

const settings = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Helper that returns the plugin settings.
   * @returns {Object} the settings of the plugin
   */

  get: (): object => strapi.config.get(`plugin::${PLUGIN_ID}`),

  /**
   * Helper that sets the plugin settings and returns them.
   * @param {Object} settings the desired settings for the plugin
   * @param {number} settings.size the desired size of the placeholder
   * @returns {Object} the new settings for the plugin
   */

  set: (settings: { size: number }): object => strapi.config.set(`plugin::${PLUGIN_ID}`, settings),
});

export default settings;
