import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Device } from 'react-native-ble-plx';
import ConnectedDevice from './ConnectedDevice';
import AnalogValue from './AnalogValue';
import LedControl from './LedControl';
import { colors } from '../styles/colors';

interface Props {
  connectedDevice: Device | null;
  analogValue: number | null;
  led12State: boolean;
  led13State: boolean;
  toggleLed: (ledNumber: 12 | 13) => void;
}

const ConnectedComponents: React.FC<Props> = ({
  connectedDevice,
  analogValue,
  led12State,
  led13State,
  toggleLed,
}) => (
  <View style={styles.container}>
    <ConnectedDevice device={connectedDevice} />
    <View style={styles.divider} />
    <AnalogValue value={analogValue} />
    <View style={styles.divider} />
    <LedControl
      led12State={led12State}
      led13State={led13State}
      toggleLed={toggleLed}
    />
  </View>
);

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
