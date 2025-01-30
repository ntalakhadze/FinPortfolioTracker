import {filterAssets} from '../utils/filterUtils';
import {TAsset} from '../utils/types'; // Import TAsset type

describe('filterAssets', () => {
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
    {
      id: 3,
      name: 'Asset3',
      symbol: 'A3',
      type: 'stock',
      currentPrice: 200,
      dailyChangePercent: -2,
    },
  ];

  it('should filter top gainers', () => {
    const result = filterAssets(assets, 'Top Gainers');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Asset1');
  });

  it('should filter top losers', () => {
    const result = filterAssets(assets, 'Top Losers');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Asset2');
  });

  it('should filter stocks', () => {
    const result = filterAssets(assets, 'Stocks');
    expect(result).toHaveLength(2);
  });

  it('should filter crypto', () => {
    const result = filterAssets(assets, 'Crypto');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Asset2');
  });
});
