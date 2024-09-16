import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import { colors } from '../styles/colors';

interface Props {
  devices: Device[];
  onDevicePress: (device: Device) => void;
}

const DeviceList: React.FC<Props> = ({ devices, onDevicePress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Знайдені пристрої:</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => onDevicePress(item)}
          >
            <Text style={styles.deviceName}>
              {item.name || 'Невідомий пристрій'}
            </Text>
            <Text style={styles.deviceInfo}>ID: {item.id}</Text>
            {item.rssi && (
              <Text style={styles.deviceInfo}>RSSI: {item.rssi} dBm</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightText,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  deviceInfo: {
    fontSize: 12,
    color: colors.lightText,
    marginTop: 5,
  },
});

export default DeviceList;
