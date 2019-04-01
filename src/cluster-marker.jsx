import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';

export const ClusterMarker = (props) => {
  const { coordinates, pointCount, children, onClusterClick } = props;

  if (pointCount < 0) {
    return null;
  }

  const [longitude, latitude] = coordinates;

  return (
    <Marker coordinate={{ longitude, latitude }} onPress={onClusterClick}>
      {children || (
        <View style={styles.clusterBox}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      )}
    </Marker>
  );
};

ClusterMarker.propTypes = {
  coordinates: PropTypes.array,
  pointCount: PropTypes.number,
  children: PropTypes.element,
  onClusterClick: PropTypes.func,
};

const styles = StyleSheet.create({
  clusterBox: {
    height: 62,
    width: 62,
    backgroundColor: 'black',
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: {
    fontSize: 19,
    color: '#fff',
  },
});
