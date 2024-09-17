import { useState, useCallback } from 'react';
import { Device } from 'react-native-ble-plx';
import { startStreamingData } from '../utils/bleUtils';
import { Alert } from 'react-native';

export const useDeviceConnection = () => {
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [disconnectSubscription, setDisconnectSubscription] = useState<
    (() => void) | null
  >(null);

  const connectToDevice = useCallback(
    async (device: Device, setAnalogValue: (value: number) => void) => {
      try {
        const connectedDevice = await device.connect();
        setConnectedDevice(connectedDevice);
        setIsConnected(true);
        await connectedDevice.discoverAllServicesAndCharacteristics();
        startStreamingData(connectedDevice, setAnalogValue);
        const subscription = connectedDevice.onDisconnected(() => {
          setIsConnected(false);
          reconnect(device, setAnalogValue);
        });
        setDisconnectSubscription(() => subscription.remove);
      } catch (error) {
        console.log('Помилка підключення:', error);
        throw error;
      }
    },
    []
  );

  const reconnect = useCallback(
    async (device: Device, setAnalogValue: (value: number) => void) => {
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          console.log(`Спроба перепідключення ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await device.connect();
          await device.discoverAllServicesAndCharacteristics();
          startStreamingData(device, setAnalogValue);
          setIsConnected(true);
          setConnectedDevice(device);
          console.log('Перепідключення успішне');
          return;
        } catch (error) {
          console.log(
            `Помилка перепідключення (спроба ${attempts + 1}):`,
            error
          );
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      Alert.alert(
        'Помилка підключення',
        "Не вдалося відновити з'єднання після кількох спроб."
      );
    },
    []
  );

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
  }, [connectedDevice, disconnectSubscription]);

  return {
    connectedDevice,
    isConnected,
    connectToDevice,
    disconnect,
  };
};
