import {TAsset} from './types';

export const updatePrices = (assets: TAsset[]): TAsset[] => {
  return assets.map(asset => ({
    ...asset,
    currentPrice: parseFloat((Math.random() * 5000 + 10).toFixed(2)),
    type: asset.type as 'stock' | 'crypto',
  }));
};
