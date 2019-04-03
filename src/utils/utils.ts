import { ReactNode } from 'react';

import { PACKAGE_PROPS } from './constants';

import { IClusterMapProps } from '../cluster-map';

export const createMarkers = (children: ReactNode[]) => {
  if (!Array.isArray(children)) {
    return [children];
  }

  return children;
};

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
  let text = '';
  const char_list =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    text += char_list.charAt(Math.floor(Math.random() * char_list.length));
  }
  return text;
};
