import { useState, useCallback } from 'react';
import { Device } from 'react-native-ble-plx';
import { startStreamingData } from '../utils/bleUtils';

export const useAnalogValue = () => {
  const [analogValue, setAnalogValue] = useState<number | null>(null);

  const startAnalogValueStreaming = useCallback((device: Device) => {
    startStreamingData(device, setAnalogValue);
  }, []);

  return {
    analogValue,
    startAnalogValueStreaming,
  };
};
