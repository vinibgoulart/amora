import React, { useCallback, useEffect } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useLazyLoadQuery, useQueryLoader } from 'react-relay';

import { Header } from './Header';
import { Product } from '../ui/Product';
import { Button } from '../ui/Button';
import { useAuth } from '../../core/auth/useAuth';
import { StoreDetailsQuery } from './StoreDetailsQuery';

import type { StoreDetailsQuery as StoreDetailsQueryType } from './__generated__/StoreDetailsQuery.graphql';

export function StoreDetails() {
  const { navigate } = useNavigation();
  const { token } = useAuth();
  const { params } = useRoute();
  const { storeId } = params;

  const data = useLazyLoadQuery<StoreDetailsQueryType>(
    StoreDetailsQuery,
    { storeId },
    { fetchPolicy: 'store-and-network', fetchKey: new Date().toString() }
  );

  const [, loadQueryStoreDetails] = useQueryLoader(StoreDetailsQuery);
  const refrehStoreDetails = useCallback(
    () => loadQueryStoreDetails({}, { fetchPolicy: 'network-only' }),
    []
  );

  const userPoints =
    data?.userPoints?.edges.length > 0
      ? data?.userPoints?.edges[0].node
      : { points: 0 };

  useEffect(() => {
    setInterval(() => {
      refrehStoreDetails();
    }, 3000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <FlatList
        data={data?.products?.edges}
        renderItem={({ item: { node } }) => (
          <Product product={node} userPoints={userPoints} />
        )}
        keyExtractor={({ node }) => node._id.toString()}
        ListHeaderComponent={() => (
          <Header store={data?.store} userPoints={userPoints} />
        )}
      />
      {token && (
        <Button
          onPress={() => navigate('QrCode')}
          title="Exibir seu QRCode"
          style={{ margin: 16, padding: 8 }}
        />
      )}
    </SafeAreaView>
  );
}
