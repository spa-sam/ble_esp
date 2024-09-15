import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/colors';

interface Props {
  value: number | null;
}

const AnalogValue: React.FC<Props> = ({ value }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: value !== null ? (value / 4095) * 100 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  if (value === null) return null;

  const percentage = (value / 4095) * 100;

  return (
    <View style={styles.analogValueCard}>
      <Text style={styles.analogValueTitle}>Дані з аналогового датчика:</Text>
      <Text style={styles.analogValue}>{value}</Text>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  analogValueCard: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  analogValueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.primary,
  },
  analogValue: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 15,
    color: colors.text,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 25,
    backgroundColor: colors.lightText,
    borderRadius: 12.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
  },
  percentageText: {
    fontSize: 16,
    textAlign: 'right',
    marginTop: 10,
    color: colors.primary,
  },
});
export default AnalogValue;
