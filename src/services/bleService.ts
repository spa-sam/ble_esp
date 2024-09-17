import { Device } from 'react-native-ble-plx';
import {
  ESP32_SERVICE_UUID,
  ESP32_CHARACTERISTIC_UUID,
} from '../constants/bleConstants';
import { decode as base64decode } from 'base-64';

export const connectToDevice = async (device: Device): Promise<Device> => {
  const connectedDevice = await device.connect();
  await connectedDevice.discoverAllServicesAndCharacteristics();
  return connectedDevice;
};

export const disconnectDevice = async (device: Device): Promise<void> => {
  await device.cancelConnection();
};

export const startStreamingData = (
  device: Device,
  onDataReceived: (value: number) => void
): (() => void) => {
  const subscription = device.monitorCharacteristicForService(
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
        onDataReceived(rawValue);
      }
    }
  );

  return () => subscription.remove();
};

export const writeCharacteristic = async (
  device: Device,
  serviceUUID: string,
  characteristicUUID: string,
  value: string
): Promise<void> => {
  await device.writeCharacteristicWithoutResponseForService(
    serviceUUID,
    characteristicUUID,
    value
  );
};
