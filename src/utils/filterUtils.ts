import {FilterType, TAsset} from './types';

export const filterAssets = (
  assets: TAsset[],
  filterType: FilterType,
): TAsset[] => {
  const filters: Record<FilterType, (asset: TAsset) => boolean> = {
    'Top Gainers': asset => asset.dailyChangePercent > 0,
    'Top Losers': asset => asset.dailyChangePercent < 0,
    Stocks: asset => asset.type === 'stock',
    Crypto: asset => asset.type === 'crypto',
  };

  return assets.filter(filters[filterType]);
};
