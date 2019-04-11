# react-native-maps-clusterize

React Native component that adds map clustering 

## Examples

| Zoom in | Zoom out |
| --- | --- |
| ![](example/images/zoom-out.gif) | ![](example/images/zoom-in.gif) |
| **Cluster Expand** | **Nested Cluster Expand** |
| ![](example/images/cluster-expand.gif) | ![](example/images/nested-cluster-expand.gif) |

## Installation

1. Install [`react-native-maps`](https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md)

2) Install this component

```
npm install --save react-native-maps-clusterize
```

## Usage

```
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

```
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
```
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

**Result**

![](example/images/custom-marker.png)


## Props

| Props                    | Type         | Default                                               | Note                                   |
| ------------------------ | ------------ | ----------------------------------------------------- | -------------------------------------- |
| **superClusterOptions**  | _Options_    | { radius: 16, maxZoom: 15, minZoom: 1, nodeSize: 16 } | SuperCluster lib options       |
| **isClusterExpandClick** | _boolean_    | true                                                  | Enables cluster zoom on click              |
| **region**               | _Region_     | **_required_**                                                    | Google Map Region |
| **renderClusterMarker**  | ():ReactNode | () => { return \<CustomClusterMarker /> }                                                    | Returns cluster marker component         |
| **style**                | _StyleProp_  | absoluteFillObject                                    | Styling for MapView

___

> Also contains react-native-maps [\<MapView /> Props](https://github.com/react-native-community/react-native-maps/blob/master/docs/mapview.md#props)

## Events

| Event Name | Returns | Notes |
| --- | --- | --- |
| **onClusterClick** | void | Callback that is called when the user pressed on the **_cluster_** marker |

___

> Also contains react-native-maps [\<MapView /> Events](https://github.com/react-native-community/react-native-maps/blob/master/docs/mapview.md#events)

