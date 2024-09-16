import { Device } from 'react-native-ble-plx';
import { encode as base64encode } from 'base-64';
import {
  ESP32_SERVICE_UUID,
  ESP32_LED_CHARACTERISTIC_UUID,
  ESP32_BLINK_PERIOD_CHARACTERISTIC_UUID,
  ESP32_LED_CONTROL_CHARACTERISTIC_UUID,
} from '../constants/bleConstants';

export const toggleLed = async (
  connectedDevice: Device | null,
  ledNumber: 12 | 13,
  led12State: boolean,
  led13State: boolean,
  setLed12State: (state: boolean) => void,
  setLed13State: (state: boolean) => void
) => {
  if (!connectedDevice) return;

  const newState = ledNumber === 12 ? !led12State : !led13State;

  const ledControl = new Uint8Array([
    ledNumber === 12 ? 0 : 1,
    newState ? 1 : 0,
  ]);

  try {
    await connectedDevice.writeCharacteristicWithoutResponseForService(
      ESP32_SERVICE_UUID,

      ESP32_LED_CONTROL_CHARACTERISTIC_UUID,
      base64encode(String.fromCharCode.apply(null, Array.from(ledControl)))
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
export const toggleLedBlinking = async (
  connectedDevice: Device | null,
  ledNumber: 12 | 13,
  led12Blinking: boolean,
  led13Blinking: boolean,
  setLed12Blinking: (blinking: boolean) => void,
  setLed13Blinking: (blinking: boolean) => void
) => {
  if (!connectedDevice) return;

  const newState = ledNumber === 12 ? !led12Blinking : !led13Blinking;

  const ledControl = new Uint8Array([
    ledNumber === 12 ? 0 : 1,
    newState ? 2 : 1,
  ]);

  try {
    await connectedDevice.writeCharacteristicWithoutResponseForService(
      ESP32_SERVICE_UUID,
      ESP32_LED_CONTROL_CHARACTERISTIC_UUID,
      base64encode(String.fromCharCode.apply(null, Array.from(ledControl)))
    );

    if (ledNumber === 12) {
      setLed12Blinking(newState);
    } else {
      setLed13Blinking(newState);
    }
  } catch (error) {
    console.log('Помилка при зміні стану мигання світлодіода:', error);
  }
};
export const setBlinkPeriod = async (
  connectedDevice: Device | null,
  period: number
) => {
  if (!connectedDevice) return;

  const periodBytes = new Uint8Array(4);
  new DataView(periodBytes.buffer).setUint32(0, period, false);

  try {
    await connectedDevice.writeCharacteristicWithoutResponseForService(
      ESP32_SERVICE_UUID,
      ESP32_BLINK_PERIOD_CHARACTERISTIC_UUID,
      base64encode(String.fromCharCode.apply(null, Array.from(periodBytes)))
    );
  } catch (error) {
    console.log('Помилка при встановленні періоду мигання:', error);
  }
};
