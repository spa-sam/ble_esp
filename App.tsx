import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import ScanButton from './src/components/ScanButton';
import ConnectedComponents from './src/components/ConnectedComponents';
import { useBleManager } from './src/hooks/useBleManager';
import { colors } from './src/styles/colors';

export default function App() {
  const {
    isScanning,
    connectedDevice,
    analogValue,
    isConnected,
    led12State,
    led13State,
    led12Blinking,
    led13Blinking,
    isReconnecting,
    startScan,
    toggleLed,
    toggleLedBlinking,
    disconnect,
  } = useBleManager();

  const renderReconnectingText = () => (
    <Text style={styles.reconnectingText}>Переподключення...</Text>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>BLE ESP32-C3</Text>
          <View style={styles.scanButtonContainer}>
            <ScanButton
              isScanning={isScanning}
              isConnected={isConnected}
              onScanPress={startScan}
              onDisconnectPress={disconnect}
            />
          </View>
          {isConnected && (
            <ConnectedComponents
              connectedDevice={connectedDevice}
              analogValue={analogValue}
              led12State={led12State}
              led13State={led13State}
              led12Blinking={led12Blinking}
              led13Blinking={led13Blinking}
              toggleLed={toggleLed}
              toggleLedBlinking={toggleLedBlinking}
            />
          )}
          {isReconnecting && renderReconnectingText()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
  },
  scanButtonContainer: {
    marginBottom: 20,
  },
  reconnectingText: {
    textAlign: 'center',
    color: colors.warning,
    marginTop: 10,
  },
});
