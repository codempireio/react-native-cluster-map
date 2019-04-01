import { Dimensions } from 'react-native';

const getDimensions = () => {
  return {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  };
};

export const itemToGeoJSONFeature = (item) => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [
      item.props.coordinate.longitude,
      item.props.coordinate.latitude,
    ],
  },
  properties: { point_count: 0, item }, // eslint-disable-line camelcase
});

export const regionTobBox = (region) => {
  const lngD =
    region.longitudeDelta < 0
      ? region.longitudeDelta + 360
      : region.longitudeDelta;

  return [
    region.longitude - lngD, // westLng - min lng
    region.latitude - region.latitudeDelta, // southLat - min lat
    region.longitude + lngD, // eastLng - max lng
    region.latitude + region.latitudeDelta, // northLat - max lat
  ];
};

export const getBoundsZoomLevel = (bounds) => {
  const ZOOM_MAX = 20;
  const WORLD_DIM = getDimensions();

  function latRad(lat) {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  function zoom(mapPx, worldPx, fraction) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  const latFraction = (latRad(bounds[3]) - latRad(bounds[1])) / Math.PI;
  const lngDiff = bounds[2] - bounds[0];
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;
  const latZoom = zoom(WORLD_DIM.height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(WORLD_DIM.width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
};
