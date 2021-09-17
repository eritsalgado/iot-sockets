#include <SocketIoClient.h>
#include <ESP8266WiFi.h>

String ssid       = "Cargando…";
String password   = "Sup3rAdm0nPassw0rd";

byte cont         = 0;
byte max_intentos = 50;

#define LED LED_BUILTIN
#define BUTTON D1

char  toEmit[5];
int status = false;

SocketIoClient webSocket;

void setup() {  

  ConectarWifi();

  webSocket.begin("192.168.1.77", 80);
  //webSocket.begin("iot-max.herokuapp.com", 80);
  webSocket.emit("mensaje","hello from esp");
  webSocket.on("mensaje", Controlado);

  pinMode(BUTTON, INPUT);
  pinMode(LED, OUTPUT);
}

void loop() {
  webSocket.loop();

  //if(digitalRead(button) == true){
    //status != status;
    //webSocket.emit("mensaje", itoa(status, toEmit, 5));
    //digitalWrite(led, status);
  //}
  //while(digitalRead(button) == true);

    byte val = digitalRead(BUTTON);

    // Si se pucha el boton, enviar info
    if(val == HIGH){
      digitalWrite(LED, LOW); 
      webSocket.emit("mensaje", itoa(val, toEmit, 5)); 
      delay(2000);
    }else{
      digitalWrite(LED, HIGH); 
    }
  
}

void Controlado(const char* mensaje, size_t length){
  Serial.println(mensaje);
}

void ConectarWifi(){
  //Inicia Serial
  Serial.begin(115200);
  Serial.println("\n");

  // Conexión WiFi
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED and cont < max_intentos){

     cont++;
     delay(500);
     Serial.print(".");
    
  }

  Serial.println("");

  if(cont < max_intentos){
    Serial.println("****************************************");
    Serial.print("Conectado a la red WiFi: ");
    Serial.println(WiFi.SSID());
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("macAdress");
    Serial.println(WiFi.macAddress());
    Serial.println("****************************************");
  }
  else{
    Serial.println("****************************************");
    Serial.println("Error de conexion");
    Serial.println("****************************************"); 
  }
}
