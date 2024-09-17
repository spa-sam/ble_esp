import { useReducer, useEffect, useCallback, useState } from 'react';
import { Device } from 'react-native-ble-plx';
import { useBleScan } from './useBleScan';
import { connectToDevice, disconnect } from './bleConnection';
import { toggleLed, toggleLedBlinking, setBlinkPeriod } from './ledControl';
import { filterDevices } from '../utils/bleUtils';
import { bleReducer, initialState, BleAction } from '../reducers/bleReducer';
export const useBleManager = () => {
  const [state, dispatch] = useReducer(bleReducer, initialState);
  const { startScan } = useBleScan();

  const [disconnectSubscription, setDisconnectSubscription] = useState<
    null | (() => void)
  >(null);

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

        device => dispatch({ type: 'SET_CONNECTED_DEVICE', payload: device }),
        isConnected =>
          dispatch({ type: 'SET_IS_CONNECTED', payload: isConnected }),
        value => dispatch({ type: 'SET_ANALOG_VALUE', payload: value }),
        setDisconnectSubscription
      );
    } catch (error) {
      console.log('Помилка підключення:', error);
    }
  }, []);
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
  }, [handleConnectToDevice, startScan, state.cachedDevices, state.devices]);
  const handleDisconnect = useCallback(async () => {
    await disconnect(
      state.connectedDevice,
      disconnectSubscription,

      () => dispatch({ type: 'SET_CONNECTED_DEVICE', payload: null }),
      isConnected =>
        dispatch({ type: 'SET_IS_CONNECTED', payload: isConnected }),
      () => dispatch({ type: 'SET_ANALOG_VALUE', payload: null }),
      () =>
        dispatch({
          type: 'SET_LED_STATE',
          payload: { ledNumber: 12, state: false },
        }),
      () =>
        dispatch({
          type: 'SET_LED_STATE',
          payload: { ledNumber: 13, state: false },
        }),
      setDisconnectSubscription
    );
  }, [state.connectedDevice, disconnectSubscription]);

  const handleToggleLed = useCallback(
    async (ledNumber: 12 | 13) => {
      await toggleLed(
        state.connectedDevice,
        ledNumber,
        state.led12State,
        state.led13State,
        state => {
          dispatch({
            type: 'SET_LED_STATE',
            payload: { ledNumber: 12, state },
          });
          if (!state) {
            dispatch({
              type: 'SET_LED_BLINKING',
              payload: { ledNumber: 12, blinking: false },
            });
          }
        },
        state => {
          dispatch({
            type: 'SET_LED_STATE',
            payload: { ledNumber: 13, state },
          });
          if (!state) {
            dispatch({
              type: 'SET_LED_BLINKING',
              payload: { ledNumber: 13, blinking: false },
            });
          }
        }
      );
    },
    [state.connectedDevice, state.led12State, state.led13State]
  );
  const handleToggleLedBlinking = useCallback(
    async (ledNumber: 12 | 13) => {
      await toggleLedBlinking(
        state.connectedDevice,
        ledNumber,
        state.led12Blinking,
        state.led13Blinking,
        blinking =>
          dispatch({
            type: 'SET_LED_BLINKING',
            payload: { ledNumber: 12, blinking },
          }),
        blinking =>
          dispatch({
            type: 'SET_LED_BLINKING',
            payload: { ledNumber: 13, blinking },
          })
      );
    },
    [state.connectedDevice, state.led12Blinking, state.led13Blinking]
  );

  const handleSetBlinkPeriod = useCallback(
    async (period: number) => {
      await setBlinkPeriod(state.connectedDevice, period);
      dispatch({ type: 'SET_BLINK_PERIOD', payload: period });
    },
    [state.connectedDevice]
  );

  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  return {
    ...state,
    startScan: handleStartScan,
    connectToDevice: handleConnectToDevice,
    disconnect: handleDisconnect,
    toggleLed: handleToggleLed,
    toggleLedBlinking: handleToggleLedBlinking,
    setBlinkPeriod: handleSetBlinkPeriod,
    clearCache,
  };
};
