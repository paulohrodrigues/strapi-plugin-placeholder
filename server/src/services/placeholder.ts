import { getPlaiceholder } from 'plaiceholder';
import { getService } from '../utils';
import type { Core } from '@strapi/strapi';

const placeholder = ({ strapi }: { strapi: Core.Strapi }) => {
  return {
    async generate({
      hash,
      ext,
      url,
      provider,
    }: {
      hash: string;
      ext: string;
      url: string;
      provider: string;
    }): Promise<string | null> {
      try {
        const settings = getService(strapi, 'settings').get();
        let imageUrl = url;

        if (provider === 'aws-s3') {
          const objectName = `${hash}${ext}`;
          imageUrl = await getService(strapi, 'minio').get({ settings, objectName });
          if (!imageUrl) return null;
        } else if (provider !== 'local') {
          strapi.log.warn(`Provider "${provider}" is not supported by the placeholder service.`);
          return null;
        }

        const { base64 } = await getPlaiceholder(imageUrl, settings);
        return base64;
      } catch (error) {
        strapi.log.error(error);
        return null;
      }
    },
  };
};

export default placeholder;
