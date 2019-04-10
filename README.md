# react-native-maps-clusterize

React Native component that adds map clustering 

## Examples

> Here will be examples

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

