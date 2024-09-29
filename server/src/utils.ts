import mimeTypes from 'mime-types';
import { PLUGIN_ID } from './pluginId';
import { PluginServices } from './services';
import { Core } from '@strapi/strapi';

const canGeneratePlaceholder = (file) => {
  if (!file.mime) {
    // Only lookup the mime if file lacks the prop.
    const lookedUpMime = mimeTypes.lookup(file.name);
    if (lookedUpMime) {
      // lookedUpMime can return false if it failed to match
      file.mime = lookedUpMime;
    }
  }

  return file.mime?.startsWith('image/') && file.url;
};

const getService = <ServiceName extends keyof PluginServices>(
  strapi: Core.Strapi,
  serviceName: ServiceName
): PluginServices[ServiceName] => {
  return strapi.plugin(PLUGIN_ID).service(serviceName);
};

export { canGeneratePlaceholder, getService };
