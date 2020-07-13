import React from 'react';
import { Marker, Polyline } from 'react-native-maps';

import {
  makeId,
  serializeProps,
  calculateAverage,
  calculateDelta,
  formatChildren,
} from '../utils';

import { mockedReactEl } from './mock.constants';
import { repeatElement } from './mock.utils';

describe('Make ID utils function', () => {
  test(`Generated id's length have to be 10`, () => {
    const generatedId = makeId();
    expect(generatedId).toHaveLength(10);
  });

  test(`Generated id's type have to be string`, () => {
    const generatedId = makeId();
    expect(typeof generatedId).toBe('string');
  });
});

describe('formatChildren utils function', () => {
  const children = [
    <Marker key={1} coordinate={{ longitude: 100, latitude: 120 }} />,
    <Polyline key={2} isOutsideCluster={true} />,
    <Marker
      key={3}
      coordinate={{ longitude: 100, latitude: 120 }}
      isOutsideCluster={true}
    />,
  ];
  test(`formatChildren should return markers`, () => {
    const res = formatChildren(children, true);

    expect(res).toHaveLength(1);
    expect(res[0]).toBe(children[0]);
  });

  test(`formatChildren should return Polyline`, () => {
    const res = formatChildren(children, false);

    expect(res).toHaveLength(2);
    expect(res[0]).toBe(children[1]);
    expect(res[1]).toBe(children[2]);
  });

  test('formatChildren should return array', () => {
    const result = formatChildren(mockedReactEl, true);

    const isArray = Array.isArray(result);
    expect(isArray).toBeTruthy();
    expect(result).toHaveLength(1);

    const EXPECTED_LENGTH = 5;
    const mockedElemList = repeatElement(mockedReactEl, EXPECTED_LENGTH);

    const result1 = formatChildren(mockedElemList, true);
    const isArray1 = Array.isArray(result1);
    expect(isArray1).toBeTruthy();
    expect(result1).toHaveLength(EXPECTED_LENGTH);
  });
});

describe('Serialize Props utils function', () => {
  const MOCKED_PROPS: any = {
    isClusterExpandClick: true,
    superClusterOptions: {},
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    },
    onZoomChange: jest.fn(),
    renderClusterMarker: jest.fn(),
    style: {},
    onMapReady: jest.fn(),
    onClusterClick: jest.fn(),
    onRegionChangeComplete: jest.fn(),
  };

  test(`function have to return empty object`, () => {
    const emptyObj: any = {};

    expect(serializeProps(emptyObj)).toEqual(emptyObj);
    expect(serializeProps(MOCKED_PROPS)).toEqual(emptyObj);
  });

  test(`function have to return filtered props`, () => {
    const expectedObject = {
      children: jest.fn(),
    };

    const filteredProps = {
      ...MOCKED_PROPS,
      ...expectedObject,
    };

    const serializedProps = serializeProps(filteredProps);
    expect(serializedProps).toEqual(expectedObject);
  });
});

test('calculate average works as expected', () => {
  const zero = calculateAverage(0);
  const three = calculateAverage(2, 4);
  const eleven = calculateAverage(5, 4, 11, 24); // 44 / 4 = 11

  expect(zero).toBe(0);
  expect(three).toBe(3);
  expect(eleven).toBe(11);
});

test('calculateDelta works as expected', () => {
  const four = calculateDelta(6, 2);
  const four1 = calculateDelta(2, 6);
  expect(four).toBe(4);
  expect(four).toBe(four1);

  const randX = Math.random() * 10;
  const randY = Math.random() * 10;

  const result = calculateDelta(randX, randY);
  const result1 = calculateDelta(randY, randX);

  expect(result).toBe(result1);
});
