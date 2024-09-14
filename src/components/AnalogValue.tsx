import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  value: number | null;
}

const AnalogValue: React.FC<Props> = ({ value }) => {
  if (value === null) return null;

  return (
    <View style={styles.analogValueCard}>
      <Text style={styles.analogValueTitle}>Дані з аналогового датчика:</Text>
      <Text style={styles.analogValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  analogValueCard: {
    backgroundColor: '#f0f5ff',
    padding: 15,
    borderRadius: 10,
  },
  analogValueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  analogValue: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default AnalogValue;
