"use strict";
const mimeTypes = require("mime-types");
const plaiceholder = require("plaiceholder");
const AWS = require("aws-sdk");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const mimeTypes__default = /* @__PURE__ */ _interopDefault(mimeTypes);
const AWS__default = /* @__PURE__ */ _interopDefault(AWS);
const PLUGIN_ID = "placeholder";
const canGeneratePlaceholder = (file) => {
  if (!file.mime) {
    const lookedUpMime = mimeTypes__default.default.lookup(file.name);
    if (lookedUpMime) {
      file.mime = lookedUpMime;
    }
  }
  return file.mime?.startsWith("image/") && file.url;
};
const getService = (strapi, serviceName) => {
  return strapi.plugin(PLUGIN_ID).service(serviceName);
};
const bootstrap = ({ strapi }) => {
  const generatePlaceholder = async (event) => {
    const { data, where } = event.params;
    if (!data.url || !data.mime || !data.hash || !data.ext) {
      const file = await strapi.documents("plugin::upload.file").findOne(where.id);
      data.url = data.url ?? file.url;
      data.mime = data.mime ?? file.mime;
      data.hash = data.hash ?? file.hash;
      data.ext = data.ext ?? file.ext;
    }
    if (!canGeneratePlaceholder(data))
      return;
    data.placeholder = await getService(strapi, "placeholder").generate(data.url);
  };
  strapi.db.lifecycles.subscribe({
    models: ["plugin::upload.file"],
    beforeCreate: generatePlaceholder,
    beforeUpdate: generatePlaceholder
  });
};
const register = ({ strapi }) => {
  if (!strapi.plugin("upload"))
    return strapi.log.warn("Upload plugin is not installed, Plaiceholder won't be started.");
  strapi.plugin("upload").contentTypes.file.attributes.placeholder = {
    type: "text"
  };
};
const config = {
  default: {},
  validator() {
  }
};
const placeholder = ({ strapi }) => {
  return {
    async generate(url) {
      try {
        const settings2 = getService(strapi, "settings").get();
        const fetch2 = (await import("node-fetch")).default;
        const response = await fetch2(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        const { base64 } = await plaiceholder.getPlaiceholder(buffer, settings2);
        return base64;
      } catch (error) {
        if (error.message && error.message.includes("unsupported file type")) {
          strapi.log.debug(`Skipping placeholder generation for unsupported image type`);
          return null;
        }
        strapi.log.error(error);
        return null;
      }
    }
  };
};
const minio = () => ({
  async get({ settings: settings2, objectName }) {
    const s3 = new AWS__default.default.S3({
      endpoint: settings2.endpoint,
      credentials: {
        accessKeyId: settings2.accessKey,
        secretAccessKey: settings2.secretKey
      },
      s3ForcePathStyle: true
    });
    return s3.getSignedUrl("getObject", {
      Bucket: settings2.bucket,
      Key: objectName,
      Expires: 15 * 60
    });
  }
});
const settings = ({ strapi }) => ({
  /**
   * Helper that returns the plugin settings.
   * @returns {Object} the settings of the plugin
   */
  get: () => strapi.config.get(`plugin::${PLUGIN_ID}`),
  /**
   * Helper that sets the plugin settings and returns them.
   * @param {Object} settings the desired settings for the plugin
   * @param {number} settings.size the desired size of the placeholder
   * @returns {Object} the new settings for the plugin
   */
  set: (settings2) => strapi.config.set(`plugin::${PLUGIN_ID}`, settings2)
});
const services = {
  placeholder,
  minio,
  settings
};
const index = {
  register,
  bootstrap,
  config,
  services
};
module.exports = index;
//# sourceMappingURL=index.js.map
