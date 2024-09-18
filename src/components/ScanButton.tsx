import React, { useEffect, useMemo } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import { useBle } from '../context/BleContext';

const ScanButton: React.FC = () => {
  const { isScanning, isConnected, startScan, disconnect } = useBle();

  const buttonTitle = useMemo(() => {
    return isConnected
      ? 'Відключитися'
      : isScanning
        ? 'Сканування...'
        : 'Почати сканування';
  }, [isConnected, isScanning]);

  const handlePress = useMemo(() => {
    return isConnected ? disconnect : startScan;
  }, [isConnected, disconnect, startScan]);

  const spinValue = new Animated.Value(0);
  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isScanning]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isConnected ? styles.connectedButton : styles.disconnectedButton,
        isScanning && styles.scanningButton,
      ]}
      onPress={handlePress}
      disabled={isScanning}
    >
      {isScanning ? (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Icon name="bluetooth" size={24} color={colors.primary} />
        </Animated.View>
      ) : (
        <Icon
          name={isConnected ? 'bluetooth-connect' : 'bluetooth'}
          size={24}
          color={colors.background}
          style={styles.icon}
        />
      )}
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  disconnectedButton: {
    backgroundColor: colors.primary,
  },
  connectedButton: {
    backgroundColor: colors.success,
  },
  scanningButton: {
    backgroundColor: colors.warning,
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default ScanButton;
