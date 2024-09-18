import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { colors } from '../styles/colors';
import { useBle } from '../context/BleContext';
import ScanButton from '../components/ScanButton';
import LedControl from '../components/LedControl';
import AnalogValue from '../components/AnalogValue';

const MainScreen: React.FC = () => {
  const { connectedDevice } = useBle();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!connectedDevice && (
        <View style={styles.scanButtonContainer}>
          <ScanButton />
        </View>
      )}
      {connectedDevice && (
        <>
          <LedControl />
          <AnalogValue />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  scanButtonContainer: {
    marginBottom: 20,
  },
});
export default MainScreen;
