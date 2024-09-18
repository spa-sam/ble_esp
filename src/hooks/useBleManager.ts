import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { Device } from 'react-native-ble-plx';
import { useScanDevices } from './useScanDevices';
import { useDeviceConnection } from './useDeviceConnection';
import { useLedControl } from './useLedControl';
import { useAnalogValue } from './useAnalogValue';
import { filterDevices } from '../utils/bleUtils';
import { bleReducer, initialState } from '../reducers/bleReducer';

export const useBleManager = () => {
  const [state, dispatch] = useReducer(bleReducer, initialState);
  const { isScanning, startScan } = useScanDevices();
  const { connectedDevice, isConnected, connectToDevice, disconnect } =
    useDeviceConnection();
  const { toggleLed, toggleLedBlinking, setBlinkPeriod } =
    useLedControl(connectedDevice);
  const { analogValue, startAnalogValueStreaming } = useAnalogValue();

  useEffect(() => {
    dispatch({ type: 'SET_CONNECTED_DEVICE', payload: connectedDevice });
    dispatch({ type: 'SET_IS_CONNECTED', payload: isConnected });
    dispatch({ type: 'SET_IS_SCANNING', payload: isScanning });
    dispatch({ type: 'SET_ANALOG_VALUE', payload: analogValue });
  }, [connectedDevice, isConnected, isScanning, analogValue]);

  const handleConnectToDevice = useCallback(
    async (device: Device) => {
      try {
        await connectToDevice(device, value =>
          dispatch({ type: 'SET_ANALOG_VALUE', payload: value })
        );
        startAnalogValueStreaming(device);
      } catch (error) {
        console.log('Помилка підключення:', error);
      }
    },

    [connectToDevice, startAnalogValueStreaming, dispatch]
  );

  const handleStartScan = useCallback(() => {
    const cachedDevice = state.cachedDevices.find(device =>
      filterDevices([device])
    );
    if (cachedDevice) {
      handleConnectToDevice(cachedDevice);
      return;
    }

    startScan(async device => {
      try {
        const deviceWithRssi = await device.readRSSI();

        dispatch({
          type: 'SET_DEVICES',
          payload: [...state.devices, deviceWithRssi],
        });
        dispatch({
          type: 'SET_CACHED_DEVICES',
          payload: [...state.cachedDevices, deviceWithRssi],
        });
        handleConnectToDevice(deviceWithRssi);
      } catch (error) {
        console.log('Помилка при читанні RSSI:', error);
        dispatch({ type: 'SET_DEVICES', payload: [...state.devices, device] });

        dispatch({
          type: 'SET_CACHED_DEVICES',
          payload: [...state.cachedDevices, device],
        });
        handleConnectToDevice(device);
      }
    });
  }, [state.cachedDevices, state.devices, startScan, handleConnectToDevice]);

  const handleToggleLed = useCallback(
    async (ledNumber: 12 | 13) => {
      const currentState =
        ledNumber === 12 ? state.led12State : state.led13State;
      await toggleLed(ledNumber, currentState);
      dispatch({
        type: 'SET_LED_STATE',
        payload: { ledNumber, state: !currentState },
      });
    },
    [state.led12State, state.led13State, toggleLed]
  );

  const handleToggleLedBlinking = useCallback(
    async (ledNumber: 12 | 13) => {
      const currentBlinkingState =
        ledNumber === 12 ? state.led12Blinking : state.led13Blinking;
      await toggleLedBlinking(ledNumber, currentBlinkingState);
      dispatch({
        type: 'SET_LED_BLINKING',
        payload: { ledNumber, blinking: !currentBlinkingState },
      });
    },
    [state.led12Blinking, state.led13Blinking, toggleLedBlinking]
  );

  const handleSetBlinkPeriod = useCallback(
    async (period: number) => {
      await setBlinkPeriod(period);
      dispatch({ type: 'SET_BLINK_PERIOD', payload: period });
    },
    [setBlinkPeriod]
  );

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  return {
    ...state,
    startScan: handleStartScan,
    connectToDevice: handleConnectToDevice,
    disconnect,
    toggleLed: handleToggleLed,
    toggleLedBlinking: handleToggleLedBlinking,
    setBlinkPeriod: handleSetBlinkPeriod,
    clearCache,
  };
};
