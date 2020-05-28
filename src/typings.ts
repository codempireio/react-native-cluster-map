import { ReactNode, ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LatLng, MapViewProps, Region, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import SuperCluster from 'supercluster';

export interface IClusterMapProps extends MapViewProps {
  isClusterExpandClick: boolean;
  superClusterOptions?: object;
  priorityMarker?: React.ReactElement;
  region: Region;
  children: ReactElement[] | ReactElement;
  style: StyleProp<ViewStyle>;
  onZoomChange?: (zoom: number) => void;
  renderClusterMarker: (pointCount: number) => ReactNode;
  onMapReady: () => void;
  onClusterClick: (clusterClickEvent?: IClusterClickEvent,
    clusterChildren?: Array<SuperCluster.ClusterFeature<any>>
      | Array<SuperCluster.PointFeature<any>>) => void;
  onRegionChangeComplete: (region: Region) => void;
  clusterMarkerProps?: object;
  provider: typeof PROVIDER_DEFAULT | typeof PROVIDER_GOOGLE;
}

export interface ICoords {
  latitude: number;
  longitude: number;
}

export interface IClusterMapState {
  markers:
  | Array<SuperCluster.ClusterFeature<any>>
  | Array<SuperCluster.PointFeature<any>>;
  isMapLoaded: boolean;
  currentZoom: null | number;
}

export interface IClusterClickEvent {
  clusterId: number;
  coordinate: LatLng;
}

export interface IClusterMarkerProps {
  coordinates: number[];
  pointCount: number;
  children: ReactNode;
  clusterId: number;
  onClusterMarkerPress: (clusterClickEvent: IClusterClickEvent) => void;
  clusterMarkerProps?: object;
}

export interface IMarkerEvent {
  action: 'marker-press';
  id: string;
}
