import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

interface Props {
  led12State: boolean;
  led13State: boolean;
  toggleLed: (ledNumber: 12 | 13) => void;
}

const LedControl: React.FC<Props> = ({ led12State, led13State, toggleLed }) => {
  return (
    <View style={styles.ledControlContainer}>
      <Button
        title={`LED 12: ${led12State ? 'ON' : 'OFF'}`}
        onPress={() => toggleLed(12)}
      />
      <Button
        title={`LED 13: ${led13State ? 'ON' : 'OFF'}`}
        onPress={() => toggleLed(13)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ledControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default LedControl;
