import React, { createContext, useContext, ReactNode } from 'react';
import { Device } from 'react-native-ble-plx';
import { useBleManager } from '../hooks/useBleManager';

interface BleContextType {
  devices: Device[];
  connectedDevice: Device | null;
  analogValue: number | null;
  isConnected: boolean;
  led12State: boolean;
  led13State: boolean;
  isScanning: boolean;
  isReconnecting: boolean;
  led12Blinking: boolean;
  led13Blinking: boolean;
  blinkPeriod: number;
  startScan: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnect: () => void;
  toggleLed: (ledNumber: 12 | 13) => Promise<void>;
  toggleLedBlinking: (ledNumber: 12 | 13) => Promise<void>;
  setBlinkPeriod: (period: number) => Promise<void>;
  clearCache: () => void;
}

const BleContext = createContext<BleContextType | undefined>(undefined);

export const BleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const bleManager = useBleManager();

  return (
    <BleContext.Provider value={bleManager}>{children}</BleContext.Provider>
  );
};

export const useBle = () => {
  const context = useContext(BleContext);
  if (context === undefined) {
    throw new Error('useBle must be used within a BleProvider');
  }
  return context;
};
