import { ReactNode, ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LatLng, MapViewProps, Region } from 'react-native-maps';
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
  onClusterClick: (clusterClickEvent?: IClusterClickEvent) => void;
  onRegionChangeComplete: (region: Region) => void;
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
}

export interface IMarkerEvent { action: 'marker-press'; id: string }
