import React from 'react';
import { StyleSheet } from 'react-native';
import GoogleMapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import isEqual from 'lodash.isequal';

import { ClusterMarker } from './cluster-marker';
import { clusterService } from './cluster-service';
import * as utils from './utils';

import {
  IClusterMapProps,
  IClusterMapState,
  IClusterClickEvent,
} from './typings';

const CLUSTER_EXPAND_TIME = 100;

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
    const { onZoomChange } = this.props;
    const { markers, zoom } = clusterService.getClustersOptions(region);
    if (onZoomChange) {
      onZoomChange(zoom);
    }
    this.setState({
      markers,
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

  private onClusterMarkerPress = (event: IClusterClickEvent) => {
    const { isClusterExpandClick, onClusterClick } = this.props;
    const { clusterId } = event;

    if (isClusterExpandClick) {
      const region = clusterService.expandCluster(clusterId);
      this.mapRef.animateToRegion(region, CLUSTER_EXPAND_TIME);
    }
    onClusterClick && onClusterClick(event);
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
