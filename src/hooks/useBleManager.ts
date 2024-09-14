import { useState, useEffect } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Alert } from 'react-native';
import { requestPermissions, startStreamingData } from '../utils/bleUtils';
import {
  ESP32_SERVICE_UUID,
  ESP32_CHARACTERISTIC_UUID,
  ESP32_LED_CHARACTERISTIC_UUID,
} from '../constants/bleConstants';
import { decode as base64decode, encode as base64encode } from 'base-64';

const manager = new BleManager();

export const useBleManager = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [analogValue, setAnalogValue] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [led12State, setLed12State] = useState(false);
  const [led13State, setLed13State] = useState(false);

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  const handleScanButton = async () => {
    if (isConnected) {
      if (connectedDevice) {
        await connectedDevice.cancelConnection();
      }
      setConnectedDevice(null);
      setIsConnected(false);
      setAnalogValue(null);
    } else {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const state = await manager.state();
      if (state !== 'PoweredOn') {
        Alert.alert(
          'Bluetooth вимкнено',
          'Будь ласка, увімкніть Bluetooth у налаштуваннях вашого пристрою.',
          [{ text: 'OK' }]
        );
        return;
      }

      setIsScanning(true);
      manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          console.log(error);
          setIsScanning(false);
          return;
        }
        if (device && device.name === 'ESP32-C3 Analog') {
          manager.stopDeviceScan();
          try {
            const connectedDevice = await device.connect();
            setConnectedDevice(connectedDevice);
            setIsConnected(true);
            await connectedDevice.discoverAllServicesAndCharacteristics();
            startStreamingData(connectedDevice, setAnalogValue);
          } catch (error) {
            console.log('Помилка підключення:', error);
          }
          setIsScanning(false);
        }
      });

      setTimeout(() => {
        if (!isConnected && !connectedDevice) {
          manager.stopDeviceScan();
          setIsScanning(false);
          Alert.alert('Пристрій не знайдено', 'ESP32-C3 не виявлено поблизу.');
        }
      }, 15000);
    }
  };

  const toggleLed = async (ledNumber: 12 | 13) => {
    if (!connectedDevice) return;

    const newState = ledNumber === 12 ? !led12State : !led13State;
    const ledStates = new Uint8Array([
      ledNumber === 12 ? Number(newState) : Number(led12State),
      ledNumber === 13 ? Number(newState) : Number(led13State),
    ]);

    try {
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        ESP32_SERVICE_UUID,
        ESP32_LED_CHARACTERISTIC_UUID,
        base64encode(String.fromCharCode.apply(null, Array.from(ledStates)))
      );

      if (ledNumber === 12) {
        setLed12State(newState);
      } else {
        setLed13State(newState);
      }
    } catch (error) {
      console.log('Помилка при зміні стану світлодіода:', error);
    }
  };

  return {
    isScanning,
    connectedDevice,
    analogValue,
    isConnected,
    led12State,
    led13State,
    handleScanButton,
    toggleLed,
  };
};
