import { ReactElement } from 'react';
import { Dimensions } from 'react-native';
import SuperCluster from 'supercluster';

import { Feature, Point, BBox, GeoJsonProperties } from 'geojson';
import { Region } from 'react-native-maps';

const DEFAULT_SUPERCLUSTER_OPTIONS = {
  radius: 16,
  maxZoom: 15,
  minZoom: 1,
  nodeSize: 16,
};

const INCREASE_RATE = 2;

interface ICoords {
  latitude: number;
  longitude: number;
}

class ClusterService {
  private superCluster: SuperCluster = null;
  private markers: Array<Feature<Point>> = null;

  public createClusters(
    propsOptions: object,
    children: ReactElement[] | ReactElement
  ) {
    const options = propsOptions || DEFAULT_SUPERCLUSTER_OPTIONS;
    this.superCluster = new SuperCluster(options);
    this.markers = this.createMarkers(children).map(this.createGeoJsonFeature);

    this.superCluster.load(this.markers);
  }

  public getClusters = (region: Region) => {
    const bBox = this.regionTobBox(region);
    const zoom = this.getBoundsZoomLevel(bBox);

    return this.superCluster.getClusters(bBox, zoom);
  };

  public expandCluster = (clusterId: number): Region => {
    const clusterMarkersCoordinates = this.getClusterMarkers(clusterId).map(
      this.getMarkersCoordinates
    );
    return this.getMarkersRegion(clusterMarkersCoordinates);
  };

  private createGeoJsonFeature = (element: ReactElement): Feature<Point> => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        element.props.coordinate.longitude as number,
        element.props.coordinate.latitude as number,
      ],
    },
    properties: { element },
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

  private createMarkers = (children: ReactElement[] | ReactElement) => {
    if (!children) {
      return [];
    }

    if (!Array.isArray(children)) {
      return [children];
    }

    return children;
  };

  private getClusterMarkers = (
    clusterId: number
  ): Array<SuperCluster.PointFeature<GeoJsonProperties>> => {
    const clusterChildren = this.superCluster.getChildren(clusterId);
    if (clusterChildren.length > 1) {
      return clusterChildren;
    }
    return this.getClusterMarkers(clusterChildren[0].id as number);
  };

  private getMarkersRegion = (points: ICoords[]): Region => {
    let coordinates = {
      minX: points[0].latitude,
      maxX: points[0].latitude,
      maxY: points[0].longitude,
      minY: points[0].longitude,
    };

    coordinates = points.reduce(
      (acc, point) => ({
        minX: Math.min(acc.minX, point.latitude),
        maxX: Math.max(acc.maxX, point.latitude),
        minY: Math.min(acc.minY, point.longitude),
        maxY: Math.max(acc.maxY, point.longitude),
      }),
      { ...coordinates }
    );

    const deltaX = coordinates.maxX - coordinates.minX;
    const deltaY = coordinates.maxY - coordinates.minY;

    return {
      latitude: (coordinates.minX + coordinates.maxX) / 2, // calculate center between min and max
      longitude: (coordinates.minY + coordinates.maxY) / 2, // calculate center between min and max
      latitudeDelta: deltaX * INCREASE_RATE,
      longitudeDelta: deltaY * INCREASE_RATE,
    };
  };

  private getMarkersCoordinates = (markers: Feature<Point>) => {
    const [longitude, latitude] = markers.geometry.coordinates;
    return { longitude, latitude };
  };
}

export const clusterService = new ClusterService();
