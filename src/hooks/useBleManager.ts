import { useState, useEffect, useCallback } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { Alert } from 'react-native';
import {
  requestPermissions,
  startStreamingData,
  filterDevices,
} from '../utils/bleUtils';
import {
  ESP32_SERVICE_UUID,
  ESP32_CHARACTERISTIC_UUID,
  ESP32_LED_CHARACTERISTIC_UUID,
} from '../constants/bleConstants';
import { decode as base64decode, encode as base64encode } from 'base-64';

const manager = new BleManager();

export const useBleManager = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [analogValue, setAnalogValue] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [led12State, setLed12State] = useState(false);
  const [led13State, setLed13State] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const [disconnectSubscription, setDisconnectSubscription] = useState<
    null | (() => void)
  >(null);

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  const connectToDevice = useCallback(async (device: Device) => {
    try {
      const connectedDevice = await device.connect();
      setConnectedDevice(connectedDevice);
      setIsConnected(true);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      startStreamingData(connectedDevice, setAnalogValue);
      const subscription = connectedDevice.onDisconnected(() => {
        setIsConnected(false);
        reconnect(device);
      });
      setDisconnectSubscription(() => subscription.remove);
    } catch (error) {
      console.log('Помилка підключення:', error);
      throw error;
    }
  }, []);

  const startScan = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsScanning(true);
    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        console.log(error);
        setIsScanning(false);
        return;
      }
      if (device) {
        const filteredDevice = filterDevices([device]);
        if (filteredDevice) {
          manager.stopDeviceScan();
          setIsScanning(false);
          await connectToDevice(filteredDevice);
        }
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  }, [connectToDevice]);

  const reconnect = useCallback(async (device: Device) => {
    setIsReconnecting(true);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        console.log(`Спроба перепідключення ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Спроба підключення до пристрою...');
        await device.connect();
        await device.discoverAllServicesAndCharacteristics();
        startStreamingData(device, setAnalogValue);
        setIsReconnecting(false);
        setIsConnected(true);
        setConnectedDevice(device);
        console.log('Перепідключення успішне');
        return;
      } catch (error) {
        console.log(`Помилка перепідключення (спроба ${attempts + 1}):`, error);
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    setIsReconnecting(false);
    Alert.alert(
      'Помилка підключення',
      "Не вдалося відновити з'єднання після кількох спроб."
    );
  }, []);

  const disconnect = useCallback(async () => {
    if (connectedDevice) {
      try {
        if (disconnectSubscription) {
          disconnectSubscription();
          setDisconnectSubscription(null);
        }
        await connectedDevice.cancelConnection();
      } catch (error) {
        console.log('Помилка при відключенні:', error);
      }
    }
    setConnectedDevice(null);
    setIsConnected(false);
    setAnalogValue(null);
    setLed12State(false);
    setLed13State(false);
  }, [connectedDevice, disconnectSubscription]);

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
    devices,
    connectedDevice,
    analogValue,
    isConnected,
    led12State,
    led13State,
    isReconnecting,
    startScan,
    connectToDevice,
    disconnect,
    toggleLed,
  };
};
