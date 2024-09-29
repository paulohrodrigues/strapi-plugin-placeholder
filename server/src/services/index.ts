import placeholder from './placeholder';
import minio from './minio';
import settings from './settings';

const services = {
  placeholder,
  minio,
  settings,
};

export type PluginServices = {
  [key in keyof typeof services]: ReturnType<(typeof services)[key]>;
};
export default services;
