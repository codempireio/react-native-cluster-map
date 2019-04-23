# react-native-maps-clusterize

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![Version](https://img.shields.io/npm/v/react-native-maps-clusterize.svg)](https://www.npmjs.com/package/react-native-maps-clusterize)
[![npm](https://img.shields.io/npm/dt/react-native-maps-clusterize.svg)](https://www.npmjs.com/package/react-native-maps-clusterize)
[![Email](https://img.shields.io/badge/contact-CODEMPIRE-blue.svg?style=flat)](mailto:info@codempire.io)

React Native MapView clustering component for iOS + Android

___

Made by [CODEMPIRE](http://codempire.io/)

## Examples

| Zoom in                                                      | Zoom out                                                                   |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| ![Example zoom out](example/images/zoom-out.gif)             | ![Example zoom in](example/images/zoom-in.gif)                             |
| **Cluster Expand**                                           | **Nested Cluster Expand**                                                  |
| ![Example cluster expand](example/images/cluster-expand.gif) | ![Example nested cluster expand](example/images/nested-cluster-expand.gif) |

## Installation

1. Install [`react-native-maps`](https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md)

2. Install this component

```bash
npm install --save react-native-maps-clusterize
```

## Usage

```javascript
import { Marker } from "react-native-maps";
import { ClusterMap } from "react-native-maps-clusterize";

<ClusterMap
  region={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  <Marker coordinate={{ latitude:37.78725, longitude: -122.434 }} />
  <Marker coordinate={{ latitude:37.789, longitude: -122.431 }} />
  <Marker coordinate={{ latitude:37.78825, longitude:-122.4324 }} />
</ClusterMap>
```

### Custom Cluster Marker

You can customize cluster marker with **renderClusterMarker** prop

> *MyMap.jsx*

```javascript
import { Marker } from "react-native-maps";
import { MyCluster } from "./MyCluster";

// ...

renderCustomClusterMarker = (count) => <MyCluster count={count} />

render () {
  const { markers, region } = this.state;
  return (
    <ClusterMap
      renderClusterMarker={this.renderCustomClusterMarker}
      region={region}
    >
      {markers.map((marker) => (
          <Marker {...marker} />
      ))}
    <ClusterMap>
  )
}

```

> *MyCluster.jsx*

```javascript
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MyCluster = (props) => {
  const { count } = props;
  return (
    <View style={styles}>
      <Text>{count}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: 'red',
  justifyContent: 'center',
  alignItems: 'center'
})
```

### Result

![Custom Marker Example](example/images/custom-marker.png)

## Props

| Props                    | Type         | Default                                               | Note                             |
| ------------------------ | ------------ | ----------------------------------------------------- | -------------------------------- |
| **superClusterOptions**  | _Options_    | { radius: 16, maxZoom: 15, minZoom: 1, nodeSize: 16 } | SuperCluster lib options         |
| **isClusterExpandClick** | _boolean_    | true                                                  | Enables cluster zoom on click    |
| **region**               | _Region_     | **_required_**                                        | Google Map Region                |
| **priorityMarker**  | _ReactNode_    | null | Marker which will be outside of clusters       
| **renderClusterMarker**  | ():ReactNode | () => { return \<CustomClusterMarker /> }             | Returns cluster marker component |
| **style**                | _StyleProp_  | absoluteFillObject                                    | Styling for MapView              |

___

> Also contains react-native-maps [\<MapView /> Props](https://github.com/react-native-community/react-native-maps/blob/master/docs/mapview.md#props)

## Events

| Event Name         | Returns | Notes                                                                     |
| ------------------ | ------- | ------------------------------------------------------------------------- |
| **onClusterClick** | void    | Callback that is called when the user pressed on the **_cluster_** marker |
| **onZoomChange**   | void    | Callback that is called with updated map zoom in **number**     

___

> Also contains react-native-maps [\<MapView /> Events](https://github.com/react-native-community/react-native-maps/blob/master/docs/mapview.md#events)
