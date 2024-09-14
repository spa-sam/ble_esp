import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Device } from 'react-native-ble-plx';

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
            <Text>{item.name || 'Невідомий пристрій'}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
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
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
  },
});

export default DeviceList;
