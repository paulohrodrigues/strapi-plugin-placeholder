import placeholder from './placeholder';
import bucket from './s3';
import settings from './settings';

const services = {
  placeholder,
  bucket,
  settings,
};

export type PluginServices = {
  [key in keyof typeof services]: ReturnType<(typeof services)[key]>;
};
export default services;
