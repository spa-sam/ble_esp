import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { useBle } from '../context/BleContext';

const ConnectedDevice: React.FC = () => {
  const { connectedDevice } = useBle();
  const [rssi, setRssi] = useState<number | null>(null);

  useEffect(() => {
    const updateRssi = async () => {
      if (connectedDevice) {
        try {
          const updatedDevice = await connectedDevice.readRSSI();
          setRssi(updatedDevice.rssi);
        } catch (error) {
          console.log('Помилка при читанні RSSI:', error);
        }
      }
    };

    updateRssi();
    const interval = setInterval(updateRssi, 5000); // Оновлюємо RSSI кожні 5 секунд

    return () => clearInterval(interval);
  }, [connectedDevice]);
  if (!connectedDevice) return null;

  return (
    <View style={styles.connectedDeviceCard}>
      <Text style={styles.connectedDeviceTitle}>Підключений пристрій:</Text>
      <Text style={styles.deviceName}>
        {connectedDevice.name || 'Невідомий пристрій'}
      </Text>
      <Text style={styles.deviceInfo}>ID: {connectedDevice.id}</Text>
      {rssi !== null && <Text style={styles.deviceInfo}>RSSI: {rssi} dBm</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  connectedDeviceCard: {
    backgroundColor: colors.secondary,
    padding: 5,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectedDeviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.text,
  },
  deviceName: {
    fontSize: 16,
    color: colors.text,
  },
  deviceInfo: {
    fontSize: 14,
    color: colors.lightText,
    marginTop: 5,
  },
});
export default ConnectedDevice;
