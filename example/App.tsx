import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import { ClusterMap } from 'react-native-cluster-map';

const markers = [
  { latitude: 37.78825, longitude: -122.4324 },
  { latitude: 37.78925, longitude: -122.4324 },
  { latitude: 37.79, longitude: -122.4324 },
  { latitude: 37.792, longitude: -122.4324 },
];

const App = () => {
  const [markersState, setMarkers] = useState<any>(markers);

  const onAddMarkers = () => {
    setMarkers([
      ...markersState,
      { latitude: 37.78825, longitude: -122.4247 },
      { latitude: 37.79925, longitude: -122.4247 },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <ClusterMap
        showsUserLocation={true}
        zoomEnabled={true}
        provider={PROVIDER_GOOGLE}
        style={{ ...StyleSheet.absoluteFillObject }}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Circle
          center={{ latitude: 37.78832, longitude: -122.419 }}
          radius={500}
          strokeColor={'#F3DB2C'}
          strokeWidth={10}
          {...{ isOutsideCluster: true }}
        />
        <Circle
          center={{ latitude: 37.78852, longitude: -122.444 }}
          radius={700}
          strokeColor={'#FF5733'}
          strokeWidth={10}
          {...{ isOutsideCluster: true }}
        />
        <Circle
          center={{ latitude: 37.78872, longitude: -122.454 }}
          radius={1000}
          strokeColor={'#3E588A'}
          strokeWidth={10}
          {...{ isOutsideCluster: true }}
        />
        {markersState.map((marker, id) => {
          return <Marker coordinate={marker} key={id} />;
        })}
      </ClusterMap>

      <TouchableOpacity onPress={onAddMarkers} style={styles.addMarkerButton}>
        <Text>Add markers</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  addMarkerButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    bottom: 30,
    left: 30,
    position: 'absolute',
    backgroundColor: '#F8E473',
    borderRadius: 12,
  },
});
