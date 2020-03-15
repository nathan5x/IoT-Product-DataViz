#include "rht03-humidity-temperature-sensor/rht03-humidity-temperature-sensor.h"
#include "SparkFun-Spark-Phant/SparkFun-Spark-Phant.h"
#include <string.h>

const char server[] = "data.sparkfun.com"; // Phant destination server
const char publicKey[] = "xxxxxx"; // Phant public key
const char privateKey[] = "xxxx"; // Phant private key

TCPClient client;
Phant phant(server, publicKey, privateKey); // Create a Phant objec

int thresholdUp = 2500;
int thresholdDown = 100;

double humidity = 0;
double temperature = 0;

/* Sensor Pin for reading D6 */
int tempHumiditySensorPin = D6;
RHT03HumidityTemperatureSensor sensor(tempHumiditySensorPin);

/* Sensor Pins for Soil Moisture sensor*/
int sensorPin = A0;
int greenLed = D0;
int yellowLed = D1;
int redLed = D2;

char publishData[50];
char soilSensorData[10];

void setup(){
  pinMode(greenLed, OUTPUT);
  pinMode(yellowLed, OUTPUT);
  pinMode(redLed, OUTPUT);

  //Serial.println("Setup done ....");
  Serial.begin(9600);

  Spark.variable("humidity", &humidity, DOUBLE);
  Spark.variable("temperature", &temperature, DOUBLE);

  Spark.subscribe("dry-moisture-captured", handleDryMoisture);
  Spark.subscribe("wet-moisture-captured", handleWetMoisture);
}

void handleDryMoisture(const char *event, const char *data)
{
 // Serial.print(event);
 // Serial.print(",Dry  data: ");
  if (data) {
    Serial.println(data);
    digitalWrite(redLed, HIGH);
    digitalWrite(greenLed, LOW);
    digitalWrite(yellowLed, LOW);
  }
  else {
   // Serial.println("NULL");
  }
}

void handleWetMoisture(const char *event, const char *data)
{
  //Serial.print(event);
 // Serial.print(", Wet data: ");
  if (data) {
    Serial.println(data);
    digitalWrite(greenLed, HIGH);
    digitalWrite(yellowLed, LOW);
    digitalWrite(redLed, LOW);
  }
  else {
  //  Serial.println("NULL");
  }
}

void loop() {

  int sensorValue;
  sensorValue = analogRead(sensorPin);

  //Serial.println(sensorValue);
  sprintf(soilSensorData,"%.d",sensorValue);
  if (sensorValue <= thresholdDown){

   // Serial.println("Dry Water it...");
    Spark.publish("dry-moisture-captured", soilSensorData);

  } else if (sensorValue >= thresholdUp){

    //Serial.println("Wet leave it...");
    Spark.publish("wet-moisture-captured", soilSensorData);

  } else {

   // Serial.println("Normal leave it...");
   // Serial.println("Requires attention...");

    digitalWrite(yellowLed, LOW);
    digitalWrite(redLed, HIGH);
    digitalWrite(greenLed, HIGH);

  }

  phant.add("moisture", sensorValue);
  phant.add("timestamp", -42);

  if (client.connect(server, 80)) {
      //Serial.println("Connected....");
      client.print(phant.post());
  }

  delay(500); //wait for half a second

  sensor.update();
  temperature = sensor.getTemperature();
  humidity = sensor.getHumidity();

  //Serial.println("t/rh");
  //Serial.println(temperature);
  //Serial.println(humidity);
  // serialOutputStr = "sss:"+temperature+":"+humidity+":"+Time.timeStr();
  sprintf(publishData,"%.2f@%.2f",temperature,humidity);

  strcat(publishData, "@");
  strcat(publishData, Time.timeStr());
  Serial.println(publishData);

  Spark.publish("rht03-data-captured",publishData);
}
