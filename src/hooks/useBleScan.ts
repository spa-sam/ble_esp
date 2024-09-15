import { useState, useCallback } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { requestPermissions, filterDevices } from '../utils/bleUtils';

const manager = new BleManager();

export const useBleScan = () => {
  const [isScanning, setIsScanning] = useState(false);

  const startScan = useCallback(
    async (onDeviceFound: (device: Device) => void) => {
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
            onDeviceFound(filteredDevice);
          }
        }
      });

      setTimeout(() => {
        manager.stopDeviceScan();
        setIsScanning(false);
      }, 10000);
    },
    []
  );

  return { isScanning, startScan };
};
