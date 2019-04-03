import * as React from 'react';
import { StyleSheet, StyleProp, ViewProps } from 'react-native';
import GoogleMapView, {
  PROVIDER_GOOGLE,
  Marker,
  Region,
  MapViewProps,
} from 'react-native-maps';
import Supercluster from 'supercluster';
import { Feature, Point } from 'geojson';

import { ClusterMarker } from './cluster-marker';

import * as mapUtils from './utils/map-utils';
import * as utils from './utils/utils';
import { DEFAULT_SUPERCLUSTER_OPTIONS } from './utils/constants';

export interface IClusterMapProps extends MapViewProps {
  superclusterOptions: object;
  region: Region;
  children: Marker[];
  renderClusterMarker: Function;
  style: StyleProp<ViewProps>;
  onMapReady: () => void;
  onClusterClick: () => void;
  onRegionChangeComplete: (region: Region) => void;
}

interface IClusterMapState {
  markers:
    | Supercluster.ClusterFeature<any>[]
    | Supercluster.PointFeature<any>[];
  isMapLoaded: boolean;
}

export class ClusterMap extends React.PureComponent<
  IClusterMapProps,
  IClusterMapState
> {
  state: IClusterMapState = {
    markers: [],
    isMapLoaded: false,
  };

  // TODO: Try to extract supercluster to service
  superCluster: Supercluster = null;
  rawData: Feature<Point>[] = null;

  componentDidMount() {
    this.clusterize();
  }

  componentWillReceiveProps(nextProps: IClusterMapProps) {
    // TODO: create array compare utils
    if (this.rawData.length !== nextProps.children.length) {
      this.clusterize();
    }
  }

  onRegionChangeComplete = (region: Region) => {
    this.generateMarkers(region);
    this.props.onRegionChangeComplete &&
      this.props.onRegionChangeComplete(region);
  };

  clusterize = () => {
    const { superclusterOptions, region, children } = this.props;

    const markers = utils.createMarkers(children) || [];
    const options = superclusterOptions || DEFAULT_SUPERCLUSTER_OPTIONS;
    this.superCluster = new Supercluster(options);
    this.rawData = markers.map(mapUtils.itemToGeoJSONFeature);
    this.superCluster.load(this.rawData);

    this.generateMarkers(region);
  };

  generateMarkers = (region: Region) => {
    const bBox = mapUtils.regionTobBox(region);
    const zoom = mapUtils.getBoundsZoomLevel(bBox);

    const markers = this.superCluster.getClusters(bBox, zoom);

    this.setState({
      markers,
    });
  };

  renderMarkers = () => {
    const { markers } = this.state;
    const { onClusterClick, renderClusterMarker } = this.props;

    return markers.map((marker) => {
      const { properties, geometry } = marker;
      const { cluster, item, point_count } = properties;

      if (!cluster && item) {
        return <Marker {...item.props} key={utils.makeId()} />;
      }

      return (
        <ClusterMarker
          pointCount={point_count}
          coordinates={geometry.coordinates}
          onClusterClick={onClusterClick}
          key={utils.makeId()}
        >
          {renderClusterMarker && renderClusterMarker(point_count)}
        </ClusterMarker>
      );
    });
  };

  render() {
    const { style, region } = this.props;

    return (
      <GoogleMapView
        {...utils.serializeProps(this.props)}
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

  onMapReady = () => {
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
