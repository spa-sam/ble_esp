#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define LED_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a9"
#define BLINK_PERIOD_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26aa"
#define LED_CONTROL_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26ab"

#define ANALOG_PIN 1
#define LED_PIN_12 12
#define LED_PIN_13 13

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
BLECharacteristic* pLedCharacteristic = NULL;
BLECharacteristic* pBlinkPeriodCharacteristic = NULL;
BLECharacteristic* pLedControlCharacteristic = NULL;

bool deviceConnected = false;
uint32_t blinkPeriod = 1000;

enum LedState {
  LED_OFF,
  LED_ON,
  LED_BLINK
};

LedState led12State = LED_OFF;
LedState led13State = LED_OFF;

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Пристрій підключено");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Пристрій відключено");
    }
};

class LedCharacteristicCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String value = pCharacteristic->getValue();
      if (value.length() == 2) {
        led12State = value[0] ? LED_ON : LED_OFF;
        led13State = value[1] ? LED_ON : LED_OFF;
        Serial.printf("Оновлено стан світлодіодів: LED12 = %d, LED13 = %d\n", led12State, led13State);
      }
    }
};

class LedControlCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String value = pCharacteristic->getValue();
      if (value.length() == 2) {
        uint8_t ledNumber = value[0];
        uint8_t state = value[1];
        
        if (ledNumber == 0) {
          led12State = (LedState)state;
          Serial.printf("Оновлено стан LED12: %d\n", led12State);
        } else if (ledNumber == 1) {
          led13State = (LedState)state;
          Serial.printf("Оновлено стан LED13: %d\n", led13State);
        }
      }
    }
};

class BlinkPeriodCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String value = pCharacteristic->getValue();
      if (value.length() == 4) {
        blinkPeriod = *((uint32_t*)value.c_str());
        Serial.printf("Оновлено період мигання: %d мс\n", blinkPeriod);
      }
    }
};

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN_12, OUTPUT);
  pinMode(LED_PIN_13, OUTPUT);

  BLEDevice::init("ESP32-C3 Analog");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pLedCharacteristic = pService->createCharacteristic(
                      LED_CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_WRITE
                    );

  pBlinkPeriodCharacteristic = pService->createCharacteristic(
                      BLINK_PERIOD_CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_WRITE
                    );

  pLedControlCharacteristic = pService->createCharacteristic(
                      LED_CONTROL_CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_WRITE
                    );

  pLedCharacteristic->setCallbacks(new LedCharacteristicCallbacks());
  pLedControlCharacteristic->setCallbacks(new LedControlCallbacks());
  pBlinkPeriodCharacteristic->setCallbacks(new BlinkPeriodCallbacks());

  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);
  BLEDevice::startAdvertising();
  Serial.println("BLE пристрій готовий до підключення!");
}

void updateLedState(uint8_t pin, LedState state) {
  switch (state) {
    case LED_OFF:
      digitalWrite(pin, LOW);
      break;
    case LED_ON:
      digitalWrite(pin, HIGH);
      break;
    case LED_BLINK:
      digitalWrite(pin, (millis() / blinkPeriod) % 2);
      break;
  }
}

void loop() {
  if (deviceConnected) {
    uint16_t analogValue = analogRead(ANALOG_PIN);
    pCharacteristic->setValue((uint8_t*)&analogValue, 2);
    pCharacteristic->notify();
    
    Serial.printf("Аналогове значення: %d\n", analogValue);
    
    updateLedState(LED_PIN_12, led12State);
    updateLedState(LED_PIN_13, led13State);
    
    delay(200);
  } else {
    BLEDevice::startAdvertising();
    delay(500);
  }
}
