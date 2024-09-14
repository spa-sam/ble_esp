import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Device } from 'react-native-ble-plx';

interface Props {
  device: Device | null;
}

const ConnectedDevice: React.FC<Props> = ({ device }) => {
  if (!device) return null;

  return (
    <View style={styles.connectedDeviceCard}>
      <Text style={styles.connectedDeviceTitle}>Підключений пристрій:</Text>
      <Text>{device.name || device.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  connectedDeviceCard: {
    backgroundColor: '#e6f7ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  connectedDeviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ConnectedDevice;
