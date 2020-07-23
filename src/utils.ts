import { ReactElement } from 'react';
import { IClusterMapProps } from './typings';

const PACKAGE_PROPS = [
  'isClusterExpandClick',
  'superClusterOptions',
  'renderClusterMarker',
  'style',
  'onMapReady',
  'onRegionChangeComplete',
  'region',
  'onClusterClick',
  'priorityMarker',
  'onZoomChange',
];

export const formatChildren = (
  children: ReactElement[] | ReactElement,
  isInCluster: boolean
) => {
  if (!children) {
    return [];
  }

  const childrenList = !Array.isArray(children) ? [children] : children;

  return childrenList
    .flat(1)
    .filter((child: ReactElement) =>
      isInCluster && child.props
        ? child.props.isOutsideCluster !== true
        : child.props.isOutsideCluster
    );
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
  let id = '';
  const possibleChar =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i++) {
    id += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
  }
  return id;
};

export const calculateDelta = (x: number, y: number): number =>
  x > y ? x - y : y - x;

export const calculateAverage = (...args: number[]): number => {
  const argList = [...args];
  if (!argList.length) {
    return 0;
  }

  return argList.reduce((sum, num: number) => sum + num, 0) / argList.length;
};
