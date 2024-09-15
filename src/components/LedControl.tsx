import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';

interface Props {
  led12State: boolean;
  led13State: boolean;
  toggleLed: (ledNumber: 12 | 13) => void;
}

const LedControl: React.FC<Props> = ({ led12State, led13State, toggleLed }) => {
  return (
    <View style={styles.container}>
      <View style={styles.ledControl}>
        <View style={styles.ledInfo}>
          <Icon
            name={led12State ? 'led-on' : 'led-off'}
            size={24}
            color={led12State ? colors.success : colors.lightText}
          />
          <Text style={styles.ledLabel}>12</Text>
        </View>
        <Switch
          value={led12State}
          onValueChange={() => toggleLed(12)}
          trackColor={{ false: colors.lightText, true: colors.primary }}
          thumbColor={led12State ? colors.success : colors.background}
        />
      </View>
      <View style={styles.ledControl}>
        <View style={styles.ledInfo}>
          <Icon
            name={led13State ? 'led-on' : 'led-off'}
            size={24}
            color={led13State ? colors.success : colors.lightText}
          />
          <Text style={styles.ledLabel}>13</Text>
        </View>
        <Switch
          value={led13State}
          onValueChange={() => toggleLed(13)}
          trackColor={{ false: colors.lightText, true: colors.primary }}
          thumbColor={led13State ? colors.success : colors.background}
        />
      </View>
    </View>
  );
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
});

export default LedControl;
