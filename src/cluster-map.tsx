import React, { ReactNode, ReactElement } from 'react';
import { StyleSheet, StyleProp, ViewProps } from 'react-native';
import GoogleMapView, {
  PROVIDER_GOOGLE,
  Marker,
  Region,
  MapViewProps,
} from 'react-native-maps';
import SuperCluster from 'supercluster';

import { ClusterMarker } from './cluster-marker';

import { clusterService } from './cluster-service';
import * as utils from './utils';

const CLUSTER_EXPAND_TIME = 100;

export interface IClusterMapProps extends MapViewProps {
  isClusterExpandClick: boolean;
  superClusterOptions?: object;
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
    const { style, region } = this.props;

    return (
      <GoogleMapView
        {...utils.serializeProps(this.props)}
        ref={(ref) => this.mapRef = ref}
        style={style || styles.map}
        onMapReady={this.onMapReady}
        initialRegion={region}
        onRegionChangeComplete={this.onRegionChangeComplete}
        provider={PROVIDER_GOOGLE}
      >
        {this.state.isMapLoaded && this.renderMarkers()}
      </GoogleMapView>
    );
  }

  public componentDidMount() {
    this.clusterize();
  }

  public componentWillReceiveProps(nextProps: IClusterMapProps) {
    const { children } = nextProps;
    if (clusterService.isMarkersChanged(children)) {
      this.clusterize();
    }
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
    if (this.props.isClusterExpandClick) {
      const region = clusterService.expandCluster(clusterId)
      this.mapRef.animateToRegion(region, CLUSTER_EXPAND_TIME);
    }
    this.props.onClusterClick && this.props.onClusterClick();
  }

  private renderMarkers = () => {
    const { markers } = this.state;
    const { renderClusterMarker } = this.props;

    return markers.map((marker) => {
      const { properties, geometry } = marker;
      const { cluster, item, point_count } = properties;

      const key = utils.makeId();

      if (!cluster && item) {
        return <Marker {...item.props} key={key} />;
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
