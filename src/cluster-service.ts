import { Dimensions } from 'react-native';
import Supercluster from 'supercluster';

import { Feature, Point, BBox } from 'geojson';
import { Region, Marker } from 'react-native-maps';

const DEFAULT_SUPERCLUSTER_OPTIONS = {
  radius: 16,
  maxZoom: 15,
  minZoom: 1,
  nodeSize: 16,
};

class ClusterService {
  private superCluster: Supercluster = null;
  private markers: Array<Feature<Point>> = null;

  public createClusters(propsOptions: object, markers: Marker[]) {
    const options = propsOptions || DEFAULT_SUPERCLUSTER_OPTIONS;
    this.superCluster = new Supercluster(options);
    this.markers = markers.map(this.itemToGeoJSONFeature);

    this.superCluster.load(this.markers);
  }

  public getClusters = (region: Region) => {
    const bBox = this.regionTobBox(region);
    const zoom = this.getBoundsZoomLevel(bBox);

    return this.superCluster.getClusters(bBox, zoom);
  };

  public isMarkersChanged = (newMarkers: Marker[]) => {
    // TODO: create array compare utils
    return this.markers.length !== newMarkers.length;
  };

  private itemToGeoJSONFeature = (item: Marker): Feature<Point> => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        item.props.coordinate.longitude as number,
        item.props.coordinate.latitude as number,
      ],
    },
    properties: { point_count: 0, item },
  });

  private getBoundsZoomLevel = (bounds: BBox) => {
    const ZOOM_MAX = 20;
    const WORLD_DIM = this.getDimensions();

    function latRad(lat: number) {
      const sin = Math.sin((lat * Math.PI) / 180);
      const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx: number, worldPx: number, fraction: number) {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    const latFraction = (latRad(bounds[3]) - latRad(bounds[1])) / Math.PI;
    const lngDiff = bounds[2] - bounds[0];
    const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;
    const latZoom = zoom(WORLD_DIM.height, WORLD_DIM.height, latFraction);
    const lngZoom = zoom(WORLD_DIM.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  };

  private regionTobBox = (region: Region): BBox => {
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

  private getDimensions = () => {
    return {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };
  };
}

export const clusterService = new ClusterService();
