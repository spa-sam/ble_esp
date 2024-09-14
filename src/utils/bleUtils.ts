import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { decode as base64decode } from 'base-64';
import {
  ESP32_SERVICE_UUID,
  ESP32_CHARACTERISTIC_UUID,
} from '../constants/bleConstants';

const isAndroid12OrHigher = Platform.OS === 'android' && Platform.Version >= 31;

export const requestPermissions = async () => {
  if (isAndroid12OrHigher) {
    const bluetoothScan = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
    const bluetoothConnect = await request(
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT
    );
    return (
      bluetoothScan === RESULTS.GRANTED && bluetoothConnect === RESULTS.GRANTED
    );
  } else {
    const locationPermission = await request(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );
    return locationPermission === RESULTS.GRANTED;
  }
};

export const startStreamingData = (
  device: Device,
  setAnalogValue: (value: number) => void
) => {
  device.monitorCharacteristicForService(
    ESP32_SERVICE_UUID,
    ESP32_CHARACTERISTIC_UUID,
    (error, characteristic) => {
      if (error) {
        console.log('Помилка моніторингу:', error);
        return;
      }
      if (characteristic?.value) {
        const bytes = base64decode(characteristic.value);
        const view = new Uint16Array(
          new Uint8Array(bytes.split('').map(c => c.charCodeAt(0))).buffer
        );
        const rawValue = view[0];
        setAnalogValue(rawValue);
      }
    }
  );
};
