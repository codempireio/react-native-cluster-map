import { ClusterService, INCREASE_RATE } from '../cluster-service';
import { MockFeature, repeatElement, generateMockCoords } from './test-utils';
import SuperCluster from 'supercluster';

import { MOCKED_DEVICE_WIDTH, MOCKED_DEVICE_HEIGHT, mockedReactEl, mockedRegion } from './test-constants';

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockImplementation(() => ({ width: MOCKED_DEVICE_WIDTH, height: MOCKED_DEVICE_HEIGHT }))
  }
}))

describe('Service initialization', () => {
  let service: any = null as ClusterService;

  test('Cluster service init', () => {

    expect(service).toBeFalsy();
    service = new ClusterService();
    expect(service).toBeInstanceOf(ClusterService);
  })

  test('ClusterService.createClusters init supercluster and markers', () => {

    expect(service.superCluster).toBeFalsy();
    expect(service.markers).toBeFalsy();

    service.createClusters({}, mockedReactEl);

    expect(service.superCluster).toBeInstanceOf(SuperCluster);
    expect(service.markers).toBeTruthy();
  })
})

describe('Service utils', () => {
  const service: any = new ClusterService();



  test('getMarkersCoordinates', () => {
    const longitude = 140;
    const latitude = 120;
    const Marker: any = new MockFeature({ longitude, latitude }, 1);

    const result = service.getMarkersCoordinates(Marker);

    expect(result).toHaveProperty('longitude', longitude);
    expect(result).toHaveProperty('latitude', latitude);
  })

  test('getDimensions get mocked Dimensions', () => {
    const result = service.getDimensions();
    expect(result).toHaveProperty('width', MOCKED_DEVICE_WIDTH);
    expect(result).toHaveProperty('height', MOCKED_DEVICE_HEIGHT);
  })

  test('createGeoJsonFeature', () => {
    const expectedLongitude = 55;
    const expectedLatitude = 85;

    mockedReactEl.props.coordinate.longitude = expectedLongitude;
    mockedReactEl.props.coordinate.latitude = expectedLatitude;

    const result = service.createGeoJsonFeature(mockedReactEl);

    const { type, geometry: { type: GType, coordinates } } = result;
    const [resLongitude, resLatitude] = coordinates;

    expect(type).toBeTruthy();
    expect(type).toBe('Feature');

    expect(GType).toBeTruthy();
    expect(GType).toBe('Point');

    expect(resLongitude).toBe(expectedLongitude);
    expect(resLatitude).toBe(expectedLatitude);
  })

  test('createMarkers should return array', () => {
    const result = service.createMarkers(mockedReactEl);

    const isArray = Array.isArray(result);
    expect(isArray).toBeTruthy();
    expect(result).toHaveLength(1);

    const EXPECTED_LENGTH = 5;
    const mockedElemList = repeatElement(mockedReactEl, EXPECTED_LENGTH)

    const result1 = service.createMarkers(mockedElemList);
    const isArray1 = Array.isArray(result1);
    expect(isArray1).toBeTruthy();
    expect(result1).toHaveLength(EXPECTED_LENGTH);
  })

  test('getMarkersRegion', () => {
    const coordsListLength = 8;

    const minValue = 10;
    const maxValue = 10 * coordsListLength;

    const expectedLongitude = (minValue + maxValue) / 2;
    const expectedLatitude = (minValue + maxValue) / 2;
    const expectedDelta = (maxValue - minValue) * INCREASE_RATE


    const mockedCoords = generateMockCoords(coordsListLength);
    const result = service.getMarkersRegion(mockedCoords);

    expect(result).toHaveProperty('latitude', expectedLatitude);
    expect(result).toHaveProperty('longitude', expectedLongitude);
    expect(result).toHaveProperty('latitudeDelta', expectedDelta);
    expect(result).toHaveProperty('longitudeDelta', expectedDelta);
  })

  test('regionTobBox return array with length 4', () => {
    const result = service.regionTobBox(mockedRegion);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toHaveLength(4)
  })
})



