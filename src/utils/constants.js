export const DEFAULT_SUPERCLUSTER_OPTIONS = {
  radius: 16,
  maxZoom: 15,
  minZoom: 1,
  nodeSize: 16,
};

export const ERROR_MESSAGE =
  'Please, use one method for pass markers. Either as children or as props.';

export const PACKAGE_PROPS = [
  'clusterOptions',
  'renderClusterMarker',
  'customMarker',
  'style',
  'onMapReady',
  'onRegionChangeComplete',
  'region',
  'onClusterClick',
];
