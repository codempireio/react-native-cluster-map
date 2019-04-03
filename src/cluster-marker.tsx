import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

interface IClusterMarkerProps {
  coordinates: number[];
  pointCount: number;
  children: React.ReactNode;
  onClusterClick: () => void;
}

export const ClusterMarker = (props: IClusterMarkerProps) => {
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
