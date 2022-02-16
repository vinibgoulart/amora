import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { useLazyLoadQuery, useMutation } from 'react-relay';

import { Button } from '../ui/Button';

import { ScanQrCodeUserPointsCreateOrUpdateMutation } from './ScanQrCodeUserPointsCreateOrUpdateMutation';
import type { ScanQrCodeUserPointsCreateOrUpdateMutation as ScanQrCodeUserPointsCreateOrUpdateMutationType } from './__generated__/ScanQrCodeUserPointsCreateOrUpdateMutation.graphql';

import { ScanQrCodeStoreQuery } from './ScanQrCodeStoreQuery';
import type { ScanQrCodeStoreQuery as ScanQrCodeStoreQueryType } from './__generated__/ScanQrCodeStoreQuery.graphql';

export function ScanQrCode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const [updateUserPoints, isLoading] =
    useMutation<ScanQrCodeUserPointsCreateOrUpdateMutationType>(
      ScanQrCodeUserPointsCreateOrUpdateMutation
    );

  const data = useLazyLoadQuery<ScanQrCodeStoreQueryType>(
    ScanQrCodeStoreQuery,
    {},
    { fetchPolicy: 'network-only' }
  );

  // eslint-disable-next-line functional/no-return-void
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleAddUserPoints = () => {
    // updateUserPoints({
    //   variables: {
    //     input: {
    //       points: 3,
    //       storeId: '61aeb2262dcb61ccd9f53ec2',
    //       userId: '61f8998bec8106732ce6a98d',
    //     },
    //   },
    //   onCompleted,
    // });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    const code = JSON.parse(data);

    if (code.points > 0) {
      return Alert.alert(
        `Quer remover ${code.points} ponto${
          code.points > 1 ? 's' : ''
        } deste usuário?`,
        undefined,
        [
          { text: 'Sim', onPress: () => {} },
          { text: 'Não', onPress: () => setScanned(false), style: 'cancel' },
        ]
      );
    }

    return Alert.alert('Quer adicionar 1 ponto a este usuário?', undefined, [
      { text: 'Sim', onPress: handleAddUserPoints },
      { text: 'Não', onPress: () => setScanned(false), style: 'cancel' },
    ]);
  };

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {scanned ? (
        <Button
          title="Escanear outro QRCode"
          style={{ padding: 6 }}
          onPress={() => setScanned(false)}
        />
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}
