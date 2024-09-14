import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ConnectedDevice from './src/components/ConnectedDevice';
import AnalogValue from './src/components/AnalogValue';
import LedControl from './src/components/LedControl';
import { useBleManager } from './src/hooks/useBleManager';

export default function App() {
  const {
    isScanning,
    connectedDevice,
    analogValue,
    isConnected,
    led12State,
    led13State,
    handleScanButton,
    toggleLed,
  } = useBleManager();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Тестова програма BLE для ESP32-C3</Text>

      <View style={styles.scanButtonContainer}>
        <Button
          title={
            isScanning
              ? 'Сканування...'
              : isConnected
                ? 'Відключитися'
                : 'Підключитися'
          }
          onPress={handleScanButton}
          disabled={isScanning}
        />
      </View>

      <ConnectedDevice device={connectedDevice} />
      <AnalogValue value={analogValue} />

      {isConnected && (
        <LedControl
          led12State={led12State}
          led13State={led13State}
          toggleLed={toggleLed}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scanButtonContainer: {
    marginBottom: 20,
  },
});
