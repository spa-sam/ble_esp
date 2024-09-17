import { Device } from 'react-native-ble-plx';
import { encode as base64encode } from 'base-64';
import { writeCharacteristic } from './bleService';
import {
  ESP32_SERVICE_UUID,
  ESP32_LED_CHARACTERISTIC_UUID,
  ESP32_BLINK_PERIOD_CHARACTERISTIC_UUID,
  ESP32_LED_CONTROL_CHARACTERISTIC_UUID,
} from '../constants/bleConstants';

export const toggleLed = async (
  device: Device,
  ledNumber: 12 | 13,
  currentState: boolean
): Promise<void> => {
  const newState = !currentState;
  const ledControl = new Uint8Array([
    ledNumber === 12 ? 0 : 1,
    newState ? 1 : 0,
  ]);
  const encodedValue = base64encode(
    String.fromCharCode.apply(null, Array.from(ledControl))
  );

  await writeCharacteristic(
    device,
    ESP32_SERVICE_UUID,
    ESP32_LED_CONTROL_CHARACTERISTIC_UUID,
    encodedValue
  );
};

export const toggleLedBlinking = async (
  device: Device,
  ledNumber: 12 | 13,
  currentBlinkingState: boolean
): Promise<void> => {
  const newState = !currentBlinkingState;
  const ledControl = new Uint8Array([
    ledNumber === 12 ? 0 : 1,
    newState ? 2 : 1,
  ]);
  const encodedValue = base64encode(
    String.fromCharCode.apply(null, Array.from(ledControl))
  );

  await writeCharacteristic(
    device,
    ESP32_SERVICE_UUID,
    ESP32_LED_CONTROL_CHARACTERISTIC_UUID,
    encodedValue
  );
};

export const setBlinkPeriod = async (
  device: Device,
  period: number
): Promise<void> => {
  const periodBytes = new Uint8Array(4);
  new DataView(periodBytes.buffer).setUint32(0, period, false);
  const encodedValue = base64encode(
    String.fromCharCode.apply(null, Array.from(periodBytes))
  );

  await writeCharacteristic(
    device,
    ESP32_SERVICE_UUID,
    ESP32_BLINK_PERIOD_CHARACTERISTIC_UUID,
    encodedValue
  );
};
