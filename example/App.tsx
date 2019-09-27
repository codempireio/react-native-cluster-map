import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { ClusterMap } from 'react-native-cluster-map';

const markers = [
  { latitude: 37.78825, longitude: -122.4324 },
  { latitude: 37.78925, longitude: -122.4324 },
  { latitude: 37.79, longitude: -122.4324 },
  { latitude: 37.792, longitude: -122.4324 },
];

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <ClusterMap
        provider={PROVIDER_GOOGLE}
        style={{ ...StyleSheet.absoluteFillObject }}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker, id) => {
          return <Marker coordinate={marker} key={id} />;
        })}
      </ClusterMap>
    </View>
  );
};

export default App;
