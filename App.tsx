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
import { colors } from './src/styles/colors';
import { BleProvider } from './src/context/BleContext';

export default function App() {
  return (
    <BleProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>BLE ESP32-C3</Text>
            <View style={styles.scanButtonContainer}>
              <ScanButton />
            </View>
            <ConnectedComponents />
          </View>
        </ScrollView>
      </SafeAreaView>
    </BleProvider>
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
