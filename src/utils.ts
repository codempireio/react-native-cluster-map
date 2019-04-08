import { IClusterMapProps } from './cluster-map';

const PACKAGE_PROPS = [
  'clusterOptions',
  'renderClusterMarker',
  'customMarker',
  'style',
  'onMapReady',
  'onRegionChangeComplete',
  'region',
  'onClusterClick',
];

export const serializeProps = (userProps: IClusterMapProps) => {
  return Object.keys(userProps).reduce(
    (newProps, propKey: keyof IClusterMapProps) => {
      if (PACKAGE_PROPS.find((prop) => prop === propKey)) {
        return newProps;
      }
      return { ...newProps, [propKey]: userProps[propKey] };
    },
    {}
  );
};

export const makeId = () => {
  let id = '';
  const possibleChar =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    id += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
  }
  return id;
};
