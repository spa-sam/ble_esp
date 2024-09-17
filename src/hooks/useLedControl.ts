import { useCallback } from 'react';
import { Device } from 'react-native-ble-plx';
import {
  toggleLed,
  toggleLedBlinking,
  setBlinkPeriod,
} from '../services/ledService';

export const useLedControl = (connectedDevice: Device | null) => {
  const handleToggleLed = useCallback(
    async (ledNumber: 12 | 13, ledState: boolean) => {
      if (!connectedDevice) return;
      await toggleLed(connectedDevice, ledNumber, ledState);
    },
    [connectedDevice]
  );

  const handleToggleLedBlinking = useCallback(
    async (ledNumber: 12 | 13, blinkingState: boolean) => {
      if (!connectedDevice) return;
      await toggleLedBlinking(connectedDevice, ledNumber, blinkingState);
    },
    [connectedDevice]
  );

  const handleSetBlinkPeriod = useCallback(
    async (period: number) => {
      if (!connectedDevice) return;
      await setBlinkPeriod(connectedDevice, period);
    },
    [connectedDevice]
  );

  return {
    toggleLed: handleToggleLed,
    toggleLedBlinking: handleToggleLedBlinking,
    setBlinkPeriod: handleSetBlinkPeriod,
  };
};
