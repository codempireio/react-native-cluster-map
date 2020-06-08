import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Region, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
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
  public mapRef: MapView;
  public state: IClusterMapState = {
    markers: [],
    isMapLoaded: false,
    currentZoom: null,
  };

  public render() {
    const { style, region, priorityMarker, provider } = this.props;

    return (
      <MapView
        {...utils.serializeProps(this.props)}
        ref={(ref) => (this.mapRef = ref)}
        style={style || styles.map}
        onMapReady={this.onMapReady}
        initialRegion={region}
        onRegionChangeComplete={this.onRegionChangeComplete}
        provider={provider === PROVIDER_DEFAULT ? null : PROVIDER_GOOGLE}
      >
        {this.state.isMapLoaded && this.renderChildren()}
        {priorityMarker ? priorityMarker : null}
      </MapView>
    );
  }

  public componentDidMount() {
    this.clusterize();
  }

  public componentDidUpdate(
    prevProps: IClusterMapProps,
    prevState: IClusterMapState
  ) {
    if (
      isEqual(this.props.children, prevProps.children) &&
      isEqual(this.state.currentZoom, prevState.currentZoom)
    ) {
      return;
    }
    this.clusterize();
  }

  private generateMarkers(region: Region) {
    const { markers, zoom } = clusterService.getClustersOptions(
      region,
      this.state.currentZoom
    );
    if (this.props.onZoomChange) {
      this.props.onZoomChange(zoom);
    }

    this.setState({
      markers,
    });
  }

  private onRegionChangeComplete = (region: Region) => {
    const zoom = clusterService.getCurrentZoom(region);
    if (this.state.currentZoom !== zoom) {
      this.setState({
        currentZoom: zoom,
      });
    }
    if (this.props.onRegionChangeComplete) {
      this.props.onRegionChangeComplete(region);
    }
  };

  private clusterize = () => {
    const { superClusterOptions, region, children } = this.props;
    clusterService.createClusters(
      superClusterOptions,
      children
    );
    this.generateMarkers(region);
  };

  private onClusterMarkerPress = (event: IClusterClickEvent) => {
    const { isClusterExpandClick, onClusterClick } = this.props;
    const { clusterId } = event;
    if (isClusterExpandClick) {
      const region = clusterService.expandCluster(clusterId);
      this.mapRef.animateToRegion(region, CLUSTER_EXPAND_TIME);
    }
    if (onClusterClick) {
      const clusterChildren = clusterService.getClusterChildren(clusterId);
      onClusterClick(event, clusterChildren);
    }
  };

  private renderMarkers = () => {
    const { markers } = this.state;
    const { renderClusterMarker, clusterMarkerProps } = this.props;

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
          clusterMarkerProps={clusterMarkerProps}
          key={key}
        >
          {renderClusterMarker && renderClusterMarker(point_count)}
        </ClusterMarker>
      );
    });
  };

  private renderUnclusteredChildren = () => {
    const { children } = this.props;

    if (Array.isArray(children)) {
      return children.filter((child: ReactElement) => child.props.neverCluster);
    }

    if (children.props && children.props.neverCluster) {
      return [children];
    }

    return [];
  };

  private renderChildren = () => {
    return [...this.renderMarkers(), ...this.renderUnclusteredChildren()];
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
