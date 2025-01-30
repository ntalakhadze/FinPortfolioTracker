export type TAsset = {
  id: number;
  name: string;
  symbol: string;
  type: 'stock' | 'crypto';
  currentPrice: number;
  dailyChangePercent: number;
};

export type FilterType = 'Top Gainers' | 'Top Losers' | 'Stocks' | 'Crypto';
