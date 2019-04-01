import { ERROR_MESSAGE, PACKAGE_PROPS } from './constants';

export const validateMarkerProps = (markerProps, children) => {
  if (!!markerProps && !!children) {
    throw new Error(ERROR_MESSAGE);
  }
};

export const createMarkers = (children) => {
  if (!Array.isArray(children)) {
    return [children];
  }

  return children; //children.filter(isMapMarker);
};

const isMapMarker = (child) => {
  return child.type.displayName === 'MapMarker';
};

export const serializeProps = (userProps) => {
  return Object.keys(userProps).reduce((newProps, propKey) => {
    if (PACKAGE_PROPS.find((prop) => prop === propKey)) {
      return newProps;
    }
    return { ...newProps, [propKey]: userProps[propKey] };
  }, {});
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
