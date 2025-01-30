import {updatePrices} from '../utils/priceUtils';
import {TAsset} from '../utils/types'; // Ensure correct import

describe('updatePrices', () => {
  it('should update prices with new random values', () => {
    const assets: TAsset[] = [
      {
        id: 1,
        name: 'Asset1',
        symbol: 'A1',
        type: 'stock',
        currentPrice: 100,
        dailyChangePercent: 5,
      },
      {
        id: 2,
        name: 'Asset2',
        symbol: 'A2',
        type: 'crypto',
        currentPrice: 200,
        dailyChangePercent: -2,
      },
    ];

    const updatedAssets = updatePrices(assets);

    expect(updatedAssets).toHaveLength(2);
    updatedAssets.forEach((asset, index) => {
      expect(asset.currentPrice).not.toBe(assets[index].currentPrice);
      expect(asset.currentPrice).toBeGreaterThan(10);
      expect(asset.currentPrice).toBeLessThan(5010);
    });
  });
});
