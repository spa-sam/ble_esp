import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import { useBle } from '../context/BleContext';
const LedControl: React.FC = () => {
  const {
    led12State,
    led13State,
    led12Blinking,
    led13Blinking,
    toggleLed,
    toggleLedBlinking,
  } = useBle();

  const [blinkState, setBlinkState] = useState({ led12: true, led13: true });

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(prev => ({
        led12: led12Blinking ? !prev.led12 : true,
        led13: led13Blinking ? !prev.led13 : true,
      }));
    }, 500); // Змінюємо стан кожні 500 мс

    return () => clearInterval(blinkInterval);
  }, [led12Blinking, led13Blinking]);

  const ledControls = useMemo(
    () =>
      [12, 13].map(ledNumber => (
        <View key={ledNumber} style={styles.ledControl}>
          <View style={styles.ledInfo}>
            <Icon
              name={
                ledNumber === 12
                  ? led12Blinking
                    ? blinkState.led12
                      ? 'led-on'
                      : 'led-off'
                    : led12State
                      ? 'led-on'
                      : 'led-off'
                  : led13Blinking
                    ? blinkState.led13
                      ? 'led-on'
                      : 'led-off'
                    : led13State
                      ? 'led-on'
                      : 'led-off'
              }
              size={24}
              color={
                ledNumber === 12
                  ? led12Blinking
                    ? blinkState.led12
                      ? colors.success
                      : colors.lightText
                    : led12State
                      ? colors.success
                      : colors.lightText
                  : led13Blinking
                    ? blinkState.led13
                      ? colors.success
                      : colors.lightText
                    : led13State
                      ? colors.success
                      : colors.lightText
              }
            />
            <Text style={styles.ledLabel}>{ledNumber}</Text>
          </View>
          <View style={styles.controlsContainer}>
            <Switch
              value={ledNumber === 12 ? led12State : led13State}
              onValueChange={() => toggleLed(ledNumber as 12 | 13)}
              trackColor={{ false: colors.lightText, true: colors.primary }}
              thumbColor={
                ledNumber === 12
                  ? led12State
                    ? colors.success
                    : colors.background
                  : led13State
                    ? colors.success
                    : colors.background
              }
            />
            <TouchableOpacity
              style={[
                styles.blinkButton,
                {
                  backgroundColor:
                    ledNumber === 12
                      ? led12Blinking && led12State
                        ? colors.primary
                        : colors.lightText
                      : led13Blinking && led13State
                        ? colors.primary
                        : colors.lightText,
                },
              ]}
              onPress={() => toggleLedBlinking(ledNumber as 12 | 13)}
              disabled={ledNumber === 12 ? !led12State : !led13State}
            >
              <Text style={styles.blinkButtonText}>Мигання</Text>
            </TouchableOpacity>
          </View>
        </View>
      )),
    [
      led12State,
      led13State,
      led12Blinking,
      led13Blinking,
      blinkState,
      toggleLed,
      toggleLedBlinking,
    ]
  );

  return <View style={styles.container}>{ledControls}</View>;
};
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  ledControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ledInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ledLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blinkButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 5,
  },
  blinkButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
});
export default LedControl;
