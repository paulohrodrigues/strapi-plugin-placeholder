"use strict";
const require$$1 = require("mime-types");
const require$$0$1 = require("yup");
const require$$0$2 = require("plaiceholder");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const require$$1__default = /* @__PURE__ */ _interopDefault(require$$1);
const require$$0__default = /* @__PURE__ */ _interopDefault(require$$0$1);
const require$$0__default$1 = /* @__PURE__ */ _interopDefault(require$$0$2);
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
const name = "strapi-plugin-placeholder";
const version = "4.4.1";
const description = "Generate base64 placeholders for Strapi images";
const author = {
  name: "@WalkingPizza",
  url: "https://github.com/WalkingPizza"
};
const repository = {
  type: "git",
  url: "https://github.com/WalkingPizza/strapi-plugin-placeholder"
};
const license = "MIT";
const type = "commonjs";
const exports$1 = {
  "./package.json": "./package.json",
  "./strapi-server": {
    source: "./server/src/index.js",
    "import": "./dist/server/index.mjs",
    require: "./dist/server/index.js",
    "default": "./dist/server/index.js"
  }
};
const files = [
  "dist"
];
const scripts = {
  build: "strapi-plugin build",
  verify: "strapi-plugin verify",
  watch: "strapi-plugin watch",
  "watch:link": "strapi-plugin watch:link"
};
const dependencies = {
  plaiceholder: "^2.3.0"
};
const devDependencies = {
  "@strapi/sdk-plugin": "^5.2.6",
  "@strapi/strapi": "^5.0.1",
  prettier: "^3.3.3"
};
const peerDependencies = {
  "@strapi/sdk-plugin": "^5.2.6",
  "@strapi/strapi": "^5.0.1",
  "mime-types": "2.1.35",
  sharp: "^0.30.1",
  yup: "^0.32.9"
};
const strapi = {
  name: "placeholder",
  description: "Generate base64 placeholders for your Strapi images",
  kind: "plugin",
  displayName: "Placeholder"
};
const require$$0 = {
  name,
  version,
  description,
  author,
  repository,
  license,
  type,
  exports: exports$1,
  files,
  scripts,
  dependencies,
  devDependencies,
  peerDependencies,
  strapi
};
const packageDefinition = require$$0;
var pluginId$2 = packageDefinition.strapi.name;
const pluginId$1 = pluginId$2;
const mimeTypes = require$$1__default.default;
const canGeneratePlaceholder$1 = (file) => {
  if (!file.mime) {
    const lookedUpMime = mimeTypes.lookup(file.name);
    if (lookedUpMime) {
      file.mime = lookedUpMime;
    }
  }
  return file.mime?.startsWith("image/") && file.url;
};
const getService$2 = (strapi2, service) => strapi2.plugin(pluginId$1).service(service);
var utils = {
  canGeneratePlaceholder: canGeneratePlaceholder$1,
  getService: getService$2
};
const { getService: getService$1, canGeneratePlaceholder } = utils;
var bootstrap$1 = ({ strapi: strapi2 }) => {
  const generatePlaceholder = async (event) => {
    const { data, where } = event.params;
    if (!data.url || !data.mime) {
      const file = await strapi2.entityService.findOne("plugin::upload.file", where.id);
      data.url = data.url ?? file.url;
      data.mime = data.mime ?? file.mime;
    }
    if (!canGeneratePlaceholder(data))
      return;
    data.placeholder = await getService$1(strapi2, "placeholder").generate(data.url);
  };
  strapi2.db.lifecycles.subscribe({
    models: ["plugin::upload.file"],
    beforeCreate: generatePlaceholder,
    beforeUpdate: generatePlaceholder
  });
};
var register$1 = ({ strapi: strapi2 }) => {
  if (!strapi2.plugin("upload"))
    return strapi2.log.warn("Upload plugin is not installed, Plaiceholder won't be started.");
  strapi2.plugin("upload").contentTypes.file.attributes.placeholder = {
    type: "text"
  };
};
const yup = require$$0__default.default;
var schema$1 = yup.object().shape({
  size: yup.number().min(4).max(64)
});
const schema = schema$1;
var config$1 = {
  default: () => ({}),
  validator: async (config2) => schema.validate(config2)
};
const { getPlaiceholder } = require$$0__default$1.default;
const { getService } = utils;
var placeholder$1 = ({ strapi: strapi2 }) => ({
  /**
   * Generates a base64 placeholder image for the given image.
   * @param {string} url a local or remote image URL to generate a placeholder for
   * @returns {Promise<string>} a base64 encoded placeholder image
   */
  async generate(url) {
    try {
      const settings2 = getService(strapi2, "settings").get();
      const { base64 } = await getPlaiceholder(url, settings2);
      return base64;
    } catch (e) {
      strapi2.log.error(e);
      return null;
    }
  }
});
const pluginId = pluginId$2;
var settings$1 = ({ strapi: strapi2 }) => ({
  /**
   * Helper that returns the plugin settings.
   * @returns {Object} the settings of the plugin
   */
  get: () => strapi2.config.get(`plugin.${pluginId}`),
  /**
   * Helper that sets the plugin settings and returns them.
   * @param {Object} settings the desired settings for the plugin
   * @param {number} settings.size the desired size of the placeholder
   * @returns {Object} the new settings for the plugin
   */
  set: (settings2) => strapi2.config.set(`plugin.${pluginId}`, settings2)
});
const placeholder = placeholder$1;
const settings = settings$1;
var services$1 = {
  placeholder,
  settings
};
const bootstrap = bootstrap$1;
const register = register$1;
const config = config$1;
const services = services$1;
var src = {
  bootstrap,
  register,
  config,
  services
};
const index = /* @__PURE__ */ getDefaultExportFromCjs(src);
module.exports = index;
//# sourceMappingURL=index.js.map
