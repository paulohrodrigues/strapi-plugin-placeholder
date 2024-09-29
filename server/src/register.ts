import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  if (!strapi.plugin('upload'))
    return strapi.log.warn("Upload plugin is not installed, Plaiceholder won't be started.");

  /* Update the Media Library File content type, adding the placeholder field */
  // @ts-ignore
  strapi.plugin('upload').contentTypes.file.attributes.placeholder = {
    type: 'text',
  };
};

export default register;
