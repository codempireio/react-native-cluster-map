import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { ClusterMap } from '../src';

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
      { latitude: 37.78825, longitude: -122.4647 },
      { latitude: 37.78925, longitude: -122.4647 },
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
        {markersState.map((marker, id) => {
          return <Marker coordinate={marker} key={id} />;
        })}
      </ClusterMap>

      <TouchableOpacity onPress={onAddMarkers} style={styles.addMarkerButton}>
        <Text>Set markers</Text>
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
