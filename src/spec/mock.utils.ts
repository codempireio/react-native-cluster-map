import { LatLng } from 'react-native-maps';

export class MockFeature {
  public type: string;
  public geometry: any;
  public id: string;
  public properties: any;

  constructor(coordinate: LatLng, id: string | number, props?: {}) {
    this.type = 'Feature';
    this.geometry = {
      type: 'Point',
      coordinates: [coordinate.longitude, coordinate.latitude],
    };
    this.id = `Mocked marker ${id}`;
    this.properties = props;
  }
}

export function repeatElement(elem: any, count: number) {
  return new Array(count).fill(0).map((el) => elem);
}

export function generateMockCoords(count: number) {
  return new Array(count).fill(0).map((e, i) => ({
    latitude: 10 * (i + 1),
    longitude: 10 * (i + 1),
  }));
}
