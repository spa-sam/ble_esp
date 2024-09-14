import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import ConnectedDevice from './src/components/ConnectedDevice';
import AnalogValue from './src/components/AnalogValue';
import LedControl from './src/components/LedControl';
import DeviceList from './src/components/DeviceList';
import { useBleManager } from './src/hooks/useBleManager';

export default function App() {
  const {
    isScanning,
    devices,
    connectedDevice,
    analogValue,
    isConnected,
    led12State,
    led13State,
    isReconnecting,
    startScan,
    connectToDevice,
    disconnect,
    toggleLed,
  } = useBleManager();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Тестова програма BLE для ESP32-C3</Text>
      <View style={styles.scanButtonContainer}>
        {isConnected ? (
          <Button title="Відключитися" onPress={disconnect} />
        ) : (
          <Button
            title={isScanning ? 'Сканування...' : 'Почати сканування'}
            onPress={startScan}
            disabled={isScanning}
          />
        )}
      </View>
      {isConnected && (
        <>
          <ConnectedDevice device={connectedDevice} />
          <AnalogValue value={analogValue} />
          <LedControl
            led12State={led12State}
            led13State={led13State}
            toggleLed={toggleLed}
          />
          {/* <Button title="Відключитися" onPress={disconnect} /> */}
        </>
      )}

      {isReconnecting && (
        <Text style={styles.reconnectingText}>Переподключення...</Text>
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
  reconnectingText: {
    textAlign: 'center',
    color: 'orange',
    marginTop: 10,
  },
});
