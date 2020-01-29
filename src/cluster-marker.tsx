import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker, MapEvent } from 'react-native-maps';

import { IClusterMarkerProps, IMarkerEvent } from './typings';

export const ClusterMarker = (props: IClusterMarkerProps) => {
  const {
    coordinates,
    pointCount,
    children,
    onClusterMarkerPress,
    clusterId,
    clusterMarkerProps,
  } = props;

  if (pointCount < 0) {
    return null;
  }

  const onClusterPress = (e: MapEvent<IMarkerEvent>) => {
    const { coordinate } = e.nativeEvent;
    onClusterMarkerPress({ clusterId, coordinate });
  };
  const [longitude, latitude] = coordinates;

  return (
    <Marker coordinate={{ longitude, latitude }} onPress={onClusterPress} {...clusterMarkerProps}>
      {children || (
        <View style={styles.clusterBox}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      )}
    </Marker>
  );
};

const styles = StyleSheet.create({
  clusterBox: {
    height: 60,
    width: 60,
    borderWidth: 2,
    borderColor: '#5694f7',
    backgroundColor: '#fff',
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: {
    fontSize: 19,
    color: '#5694f7',
  },
});
