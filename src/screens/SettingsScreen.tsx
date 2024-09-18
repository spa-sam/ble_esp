import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { colors } from '../styles/colors';
import { useBle } from '../context/BleContext';
import ScanButton from '../components/ScanButton';
import ConnectedDevice from '../components/ConnectedDevice';

const SettingsScreen: React.FC = () => {
  const { clearCache, connectedDevice } = useBle();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Налаштування</Text>
        <ScanButton />
        <ConnectedDevice device={connectedDevice} />
        <TouchableOpacity style={styles.button} onPress={clearCache}>
          <Text style={styles.buttonText}>Очистити кеш пристроїв</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
