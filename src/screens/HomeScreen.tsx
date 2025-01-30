import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import initialAssets from '../assets/financial_assets.json';
import {updatePrices} from '../utils/priceUtils';
import {filterAssets} from '../utils/filterUtils';
import {TAsset, FilterType} from '../utils/types';

const HomeScreen: React.FC = () => {
  const [assets, setAssets] = useState<TAsset[]>(initialAssets as TAsset[]);
  const [filterType, setFilterType] = useState<FilterType | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<TAsset | null>(null);
  const [similarAssets, setSimilarAssets] = useState<TAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => updatePrices(prevAssets));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = useMemo(
    () =>
      filterType ? filterAssets(assets, filterType as FilterType) : assets,
    [assets, filterType],
  );

  const loadMoreAssets = useCallback(() => {
    if (!isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        const nextAssets = initialAssets.slice(
          assets.length,
          assets.length + 20,
        );
        if (nextAssets.length > 0) {
          setAssets(prevAssets => [...prevAssets, ...(nextAssets as TAsset[])]);
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [isLoading, assets]);

  // Sorting with memoization
  const handleSort = useCallback((key: keyof TAsset, order: 'asc' | 'desc') => {
    setAssets(prevAssets =>
      [...prevAssets].sort((a, b) =>
        order === 'asc'
          ? String(a[key]).localeCompare(String(b[key]))
          : String(b[key]).localeCompare(String(a[key])),
      ),
    );
  }, []);

  // asset selection and finfing similar assets
  const handleAssetPress = useCallback(
    (asset: TAsset) => {
      setSelectedAsset(asset);
      const similar = assets.filter(
        item => item.type === asset.type && item.name !== asset.name,
      );
      setSimilarAssets(similar);
    },
    [assets],
  );

  if (selectedAsset) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Asset Details</Text>
        <View style={styles.assetDetails}>
          <Text style={styles.detail}>
            <Text style={styles.label}>Name: </Text>
            {selectedAsset.name}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Symbol: </Text>
            {selectedAsset.symbol}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Type: </Text>
            {selectedAsset.type}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Current Price: </Text>
            {selectedAsset.currentPrice}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Daily % Change: </Text>
            {selectedAsset.dailyChangePercent}
          </Text>
        </View>

        <Text style={styles.title}>Similar Assets</Text>
        <ScrollView
          horizontal
          style={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}>
          <Button
            title="Sort Name Asc"
            onPress={() => handleSort('name', 'asc')}
          />
          <Button
            title="Sort Name Desc"
            onPress={() => handleSort('name', 'desc')}
          />
          <Button
            title="Sort Price Asc"
            onPress={() => handleSort('currentPrice', 'asc')}
          />
          <Button
            title="Sort Price Desc"
            onPress={() => handleSort('currentPrice', 'desc')}
          />
        </ScrollView>
        <FlatList
          keyExtractor={item => `${item.id}`}
          data={similarAssets}
          renderItem={({item}) => (
            <View style={styles.similarAssetContainer}>
              <Text style={styles.similarAsset}>
                <Text style={styles.label}>Name: </Text>
                {item.name}
              </Text>
              <Text style={styles.similarAsset}>
                <Text style={styles.label}>Type: </Text>
                {item.type}
              </Text>
              <Text style={styles.similarAsset}>
                <Text style={styles.label}>Current Price: </Text>
                {item.currentPrice}
              </Text>
              <Text style={styles.similarAsset}>
                <Text style={styles.label}>Daily % Change: </Text>
                {item.dailyChangePercent}
              </Text>
            </View>
          )}
        />
        <Button title="Back to List" onPress={() => setSelectedAsset(null)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sorting & Filtering</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.scrollContainer}>
        <Button
          title="Sort Name Asc"
          onPress={() => handleSort('name', 'asc')}
        />
        <Button
          title="Sort Name Desc"
          onPress={() => handleSort('name', 'desc')}
        />
        <Button
          title="Sort Perf Asc"
          onPress={() => handleSort('dailyChangePercent', 'asc')}
        />
        <Button
          title="Sort Perf Desc"
          onPress={() => handleSort('dailyChangePercent', 'desc')}
        />
        <Button
          title="Top Gainers"
          onPress={() => setFilterType('Top Gainers')}
        />
        <Button
          title="Top Losers"
          onPress={() => setFilterType('Top Losers')}
        />
        <Button title="Stocks" onPress={() => setFilterType('Stocks')} />
        <Button title="Crypto" onPress={() => setFilterType('Crypto')} />
        <Button title="Reset" onPress={() => setFilterType(null)} />
      </ScrollView>
      <FlatList
        keyExtractor={asset => `${asset.id}`}
        data={filteredAssets}
        renderItem={({item: asset}) => (
          <TouchableOpacity
            testID={`asset-${asset.id}`}
            onPress={() => handleAssetPress(asset)}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemLabel}>
                Asset Name: <Text style={styles.itemValue}>{asset.name}</Text>
              </Text>
              <Text style={styles.itemLabel}>
                Asset Price:{' '}
                <Text style={styles.itemValue}>{asset.currentPrice}</Text>
              </Text>
              <Text style={styles.itemLabel}>
                DPC:{' '}
                <Text style={styles.itemValue}>{asset.dailyChangePercent}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMoreAssets}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" color="#fff" /> : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#151544', padding: 10},
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    margin: 10,
    borderRadius: 5,
  },
  itemLabel: {color: '#fff', fontSize: 14},
  itemValue: {fontWeight: 'bold'},
  assetDetails: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
  },
  detail: {color: '#fff', fontSize: 16, marginBottom: 5},
  label: {fontWeight: 'bold'},
  similarAssetContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 5,
  },
  similarAsset: {color: '#fff', fontSize: 14},
  scrollContainer: {marginVertical: 10, height: 80},
});

export default HomeScreen;
