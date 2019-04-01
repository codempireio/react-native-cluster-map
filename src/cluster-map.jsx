import * as React from 'react';
import { StyleSheet } from 'react-native';
import GoogleMapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Supercluster from 'supercluster';
import PropTypes from 'prop-types';

import { ClusterMarker } from './cluster-marker';

import * as mapUtils from './utils/map-utils';
import * as utils from './utils/utils';
import { DEFAULT_SUPERCLUSTER_OPTIONS } from './utils/constants';

export class ClusterMap extends React.PureComponent {
  // TODO: Try to extract supercluster to service
  superCluster = null;
  rawData = null;

  state = {
    markers: [],
    isMapLoaded: false,
  };

  componentDidMount() {
    const { children } = this.props;

    const markers = utils.createMarkers(children) || [];

    this.clusterize(markers);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: create array compare utils
    if (this.rawData.length !== nextProps.markers.length) {
      this.clusterize(nextProps.markers);
    }
  }

  onRegionChangeComplete = (region) => {
    this.generateMarkers(region);
    this.props.onRegionChangeComplete &&
      this.props.onRegionChangeComplete(region);
  };

  clusterize = (markers) => {
    const { superclusterOptions, region } = this.props;

    const options = superclusterOptions || DEFAULT_SUPERCLUSTER_OPTIONS;
    this.superCluster = new Supercluster(options);
    this.rawData = markers.map(mapUtils.itemToGeoJSONFeature);
    this.superCluster.load(this.rawData);

    this.generateMarkers(region);
  };

  generateMarkers = (region) => {
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

    return markers.map((marker, key) => {
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

ClusterMaps.propTypes = {
  superclusterOptions: PropTypes.object,
  region: PropTypes.object,
  children: PropTypes.element,
  onMapReady: PropTypes.func,
  renderClusterMarker: PropTypes.func,
  onClusterClick: PropTypes.func,
  onRegionChangeComplete: PropTypes.func,
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
