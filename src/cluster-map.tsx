import React, { ReactNode, ReactElement } from 'react';
import { StyleSheet, StyleProp, ViewProps } from 'react-native';
import GoogleMapView, {
  PROVIDER_GOOGLE,
  Region,
  MapViewProps,
} from 'react-native-maps';
import SuperCluster from 'supercluster';
import isEqual from 'lodash.isequal';

import { ClusterMarker } from './cluster-marker';

import { clusterService } from './cluster-service';
import * as utils from './utils';

const CLUSTER_EXPAND_TIME = 100;

export interface IClusterMapProps extends MapViewProps {
  isClusterExpandClick: boolean;
  superClusterOptions?: object;
  priorityMarker?: ReactElement;
  region: Region;
  children: ReactElement[] | ReactElement;
  style: StyleProp<ViewProps>;
  renderClusterMarker: (pointCount: number) => ReactNode;
  onMapReady: () => void;
  onClusterClick: () => void;
  onRegionChangeComplete: (region: Region) => void;
}

interface IClusterMapState {
  markers:
    | Array<SuperCluster.ClusterFeature<any>>
    | Array<SuperCluster.PointFeature<any>>;
  isMapLoaded: boolean;
}

export class ClusterMap extends React.PureComponent<
  IClusterMapProps,
  IClusterMapState
> {
  public static defaultProps: Partial<IClusterMapProps> = {
    isClusterExpandClick: true,
  };
  public mapRef: GoogleMapView;
  public state: IClusterMapState = {
    markers: [],
    isMapLoaded: false,
  };

  public render() {
    const { style, region, priorityMarker } = this.props;

    return (
      <GoogleMapView
        {...utils.serializeProps(this.props)}
        ref={(ref) => (this.mapRef = ref)}
        style={style || styles.map}
        onMapReady={this.onMapReady}
        initialRegion={region}
        onRegionChangeComplete={this.onRegionChangeComplete}
        provider={PROVIDER_GOOGLE}
      >
        {this.state.isMapLoaded && this.renderMarkers()}
        {priorityMarker ? priorityMarker : null}
      </GoogleMapView>
    );
  }

  public componentDidMount() {
    this.clusterize();
  }

  public componentDidUpdate(prevProps: IClusterMapProps) {
    if (isEqual(this.props.children, prevProps.children)) {
      return;
    }
    this.clusterize();
  }

  private generateMarkers(region: Region) {
    this.setState({
      markers: clusterService.getClusters(region),
    });
  }

  private onRegionChangeComplete = (region: Region) => {
    this.generateMarkers(region);
    this.props.onRegionChangeComplete &&
      this.props.onRegionChangeComplete(region);
  };

  private clusterize = () => {
    const { superClusterOptions, region, children } = this.props;

    clusterService.createClusters(superClusterOptions, children);
    this.generateMarkers(region);
  };

  private onClusterMarkerPress = (clusterId: number) => {
    const { isClusterExpandClick, onClusterClick } = this.props;
    if (isClusterExpandClick) {
      const region = clusterService.expandCluster(clusterId);
      this.mapRef.animateToRegion(region, CLUSTER_EXPAND_TIME);
    }
    onClusterClick && onClusterClick();
  };

  private renderMarkers = () => {
    const { markers } = this.state;
    const { renderClusterMarker } = this.props;

    return markers.map((marker) => {
      const { properties, geometry } = marker;
      const { cluster, element, point_count } = properties;

      const key = utils.makeId();

      if (!cluster && element) {
        return element;
      }

      return (
        <ClusterMarker
          pointCount={point_count}
          coordinates={geometry.coordinates}
          onClusterMarkerPress={this.onClusterMarkerPress}
          clusterId={marker.properties.cluster_id}
          key={key}
        >
          {renderClusterMarker && renderClusterMarker(point_count)}
        </ClusterMarker>
      );
    });
  };

  private onMapReady = () => {
    this.setState(
      {
        isMapLoaded: true,
      },
      () => this.props.onMapReady && this.props.onMapReady()
    );
  };
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
