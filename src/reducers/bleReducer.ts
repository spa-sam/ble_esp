import { Device } from 'react-native-ble-plx';

export interface BleState {
  devices: Device[];
  cachedDevices: Device[];
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
}

export type BleAction =
  | { type: 'SET_DEVICES'; payload: Device[] }
  | { type: 'SET_CACHED_DEVICES'; payload: Device[] }
  | { type: 'SET_CONNECTED_DEVICE'; payload: Device | null }
  | { type: 'SET_ANALOG_VALUE'; payload: number | null }
  | { type: 'SET_IS_CONNECTED'; payload: boolean }
  | { type: 'SET_LED_STATE'; payload: { ledNumber: 12 | 13; state: boolean } }
  | { type: 'SET_IS_SCANNING'; payload: boolean }
  | { type: 'SET_IS_RECONNECTING'; payload: boolean }
  | { type: 'CLEAR_CACHE' }
  | {
      type: 'SET_LED_BLINKING';
      payload: { ledNumber: 12 | 13; blinking: boolean };
    }
  | { type: 'SET_BLINK_PERIOD'; payload: number };

export const initialState: BleState = {
  devices: [],
  cachedDevices: [],
  connectedDevice: null,
  analogValue: null,
  isConnected: false,
  led12State: false,
  led13State: false,
  isScanning: false,
  isReconnecting: false,
  led12Blinking: false,
  led13Blinking: false,
  blinkPeriod: 1000,
};

export const bleReducer = (state: BleState, action: BleAction): BleState => {
  switch (action.type) {
    case 'SET_DEVICES':
      return { ...state, devices: action.payload };
    case 'SET_CACHED_DEVICES':
      return { ...state, cachedDevices: action.payload };
    case 'SET_CONNECTED_DEVICE':
      return { ...state, connectedDevice: action.payload };
    case 'SET_ANALOG_VALUE':
      return { ...state, analogValue: action.payload };
    case 'SET_IS_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_LED_STATE':
      return {
        ...state,
        [action.payload.ledNumber === 12 ? 'led12State' : 'led13State']:
          action.payload.state,
      };
    case 'SET_IS_SCANNING':
      return { ...state, isScanning: action.payload };
    case 'SET_IS_RECONNECTING':
      return { ...state, isReconnecting: action.payload };
    case 'CLEAR_CACHE':
      return { ...state, cachedDevices: [] };
    case 'SET_LED_BLINKING':
      return {
        ...state,
        [action.payload.ledNumber === 12 ? 'led12Blinking' : 'led13Blinking']:
          action.payload.blinking,
      };
    case 'SET_BLINK_PERIOD':
      return { ...state, blinkPeriod: action.payload };
    default:
      return state;
  }
};
