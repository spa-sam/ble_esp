import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConnectedDevice from './ConnectedDevice';
import AnalogValue from './AnalogValue';
import LedControl from './LedControl';
import { colors } from '../styles/colors';
import { useBle } from '../context/BleContext';

const ConnectedComponents: React.FC = () => {
  const {
    connectedDevice,
    analogValue,
    led12State,
    led13State,
    led12Blinking,
    led13Blinking,
    toggleLed,
    toggleLedBlinking,
  } = useBle();

  if (!connectedDevice) return null;

  return (
    <View style={styles.container}>
      <ConnectedDevice />
      <View style={styles.divider} />
      <AnalogValue />
      <View style={styles.divider} />
      <LedControl />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 10,
    marginTop: 5,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightText,
    marginVertical: 15,
    width: '100%',
  },
});

export default ConnectedComponents;
