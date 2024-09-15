import { Device } from 'react-native-ble-plx';
import { encode as base64encode } from 'base-64';
import {
  ESP32_SERVICE_UUID,
  ESP32_LED_CHARACTERISTIC_UUID,
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
  const ledStates = new Uint8Array([
    ledNumber === 12 ? Number(newState) : Number(led12State),
    ledNumber === 13 ? Number(newState) : Number(led13State),
  ]);

  try {
    await connectedDevice.writeCharacteristicWithoutResponseForService(
      ESP32_SERVICE_UUID,
      ESP32_LED_CHARACTERISTIC_UUID,
      base64encode(String.fromCharCode.apply(null, Array.from(ledStates)))
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
