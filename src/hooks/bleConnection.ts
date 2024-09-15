import { Device } from 'react-native-ble-plx';
import { startStreamingData } from '../utils/bleUtils';
import { Alert } from 'react-native';

export const connectToDevice = async (
  device: Device,
  setConnectedDevice: (device: Device | null) => void,
  setIsConnected: (isConnected: boolean) => void,
  setAnalogValue: (value: number) => void,
  setDisconnectSubscription: (subscription: (() => void) | null) => void
) => {
  try {
    const connectedDevice = await device.connect();
    setConnectedDevice(connectedDevice);
    setIsConnected(true);
    await connectedDevice.discoverAllServicesAndCharacteristics();
    startStreamingData(connectedDevice, setAnalogValue);
    const subscription = connectedDevice.onDisconnected(() => {
      setIsConnected(false);
      reconnect(
        device,
        setConnectedDevice,
        setIsConnected,
        setAnalogValue,
        setDisconnectSubscription
      );
    });
    setDisconnectSubscription(() => subscription.remove);
  } catch (error) {
    console.log('Помилка підключення:', error);
    throw error;
  }
};

export const reconnect = async (
  device: Device,
  setConnectedDevice: (device: Device | null) => void,
  setIsConnected: (isConnected: boolean) => void,
  setAnalogValue: (value: number) => void,
  setDisconnectSubscription: (subscription: (() => void) | null) => void
) => {
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

  Alert.alert(
    'Помилка підключення',
    "Не вдалося відновити з'єднання після кількох спроб."
  );
};

export const disconnect = async (
  connectedDevice: Device | null,
  disconnectSubscription: (() => void) | null,
  setConnectedDevice: (device: Device | null) => void,
  setIsConnected: (isConnected: boolean) => void,
  setAnalogValue: (value: number | null) => void,
  setLed12State: (state: boolean) => void,
  setLed13State: (state: boolean) => void,
  setDisconnectSubscription: (subscription: (() => void) | null) => void
) => {
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
};
