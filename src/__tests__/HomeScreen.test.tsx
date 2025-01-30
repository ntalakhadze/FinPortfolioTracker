import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import initialAssets from '../assets/financial_assets.json';

describe('HomeScreen', () => {
  it('should render the asset list', () => {
    const {getByText} = render(<HomeScreen />);
    expect(getByText('Sorting & Filtering')).toBeTruthy();
  });

  it('should filter top gainers', () => {
    const {getByText, getAllByTestId} = render(<HomeScreen />);
    fireEvent.press(getByText('Top Gainers'));

    const assets = getAllByTestId(/asset-/);
    expect(assets.length).toBeLessThan(initialAssets.length);
  });

  it('should sort assets by performance ascending', () => {
    const {getByText, getAllByTestId} = render(<HomeScreen />);
    fireEvent.press(getByText('Sort Perf asc'));

    const dpcs = getAllByTestId(/asset-/).map(el =>
      parseFloat(el.props['data-dpc']),
    );

    expect(dpcs).toEqual([...dpcs].sort((a, b) => a - b));
  });

  it('should show asset details on item press', () => {
    const {getByTestId, getByText} = render(<HomeScreen />);

    const firstAsset = getByTestId('asset-1'); // Using testID for precise selection
    fireEvent.press(firstAsset);

    expect(getByText('Asset Details')).toBeTruthy();
  });

  it('should display similar assets in details screen', () => {
    const {getByTestId, getByText, getAllByTestId} = render(<HomeScreen />);

    const firstAsset = getByTestId('asset-1');
    fireEvent.press(firstAsset);

    expect(getByText('Similar Assets')).toBeTruthy();

    const similarAssets = getAllByTestId(/similar-asset-/);
    expect(similarAssets.length).toBeGreaterThan(0);
  });
});
