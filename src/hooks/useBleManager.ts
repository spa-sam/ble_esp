import { useState, useEffect, useCallback } from 'react';
import { Device } from 'react-native-ble-plx';
import { useBleScan } from './useBleScan';
import { connectToDevice, disconnect } from './bleConnection';
import { toggleLed } from './ledControl';

export const useBleManager = () => {
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

  const { isScanning, startScan } = useBleScan();

  useEffect(() => {
    return () => {
      if (disconnectSubscription) {
        disconnectSubscription();
      }
    };
  }, [disconnectSubscription]);

  const handleConnectToDevice = useCallback(async (device: Device) => {
    try {
      await connectToDevice(
        device,
        setConnectedDevice,
        setIsConnected,
        setAnalogValue,
        setDisconnectSubscription
      );
    } catch (error) {
      console.log('Помилка підключення:', error);
    }
  }, []);

  const handleStartScan = useCallback(() => {
    startScan(device => {
      setDevices(prevDevices => [...prevDevices, device]);
      handleConnectToDevice(device);
    });
  }, [handleConnectToDevice, startScan]);

  const handleDisconnect = useCallback(async () => {
    await disconnect(
      connectedDevice,
      disconnectSubscription,
      setConnectedDevice,
      setIsConnected,
      setAnalogValue,
      setLed12State,
      setLed13State,
      setDisconnectSubscription
    );
  }, [connectedDevice, disconnectSubscription]);

  const handleToggleLed = useCallback(
    async (ledNumber: 12 | 13) => {
      await toggleLed(
        connectedDevice,
        ledNumber,
        led12State,
        led13State,
        setLed12State,
        setLed13State
      );
    },
    [connectedDevice, led12State, led13State]
  );

  return {
    isScanning,
    devices,
    connectedDevice,
    analogValue,
    isConnected,
    led12State,
    led13State,
    isReconnecting,
    startScan: handleStartScan,
    connectToDevice: handleConnectToDevice,
    disconnect: handleDisconnect,
    toggleLed: handleToggleLed,
  };
};
