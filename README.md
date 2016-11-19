# mqtt-websocket-stream

[![NPM](https://nodei.co/npm/mqtt-websocket-stream.png?global=true)](https://nodei.co/npm/mqtt-websocket-stream/)

This node module supports (MQTT.js)[https://github.com/mqttjs/MQTT.js] connection over WebSocket.
It is an alternative implementation to (websocket-stream)[https://github.com/maxogden/websocket-stream] 
that is better suited to particularities of MQTT.js. This module is used on (aws-mqtt)[https://github.com/kmamykin/aws-mqtt]
to connect to AWS IoT MQTT broker.

## Features
  
  * The stream implements `_writev` to efficiently buffer multiple buffer writes MQTT.js does (which calls `cork` and `uncork` on the stream to send one packet)
  * Can work with browser's WebSocket, as well as (server WebSocket implementation (ws))[https://github.com/websockets/ws]
  * Supports async socket creation
  
# Usage

`npm install mqtt-websocket-stream --save`

In node environment:

```javascript
import MqttWebSocketStream from 'mqtt-websocket-stream'
import WebSocket from 'ws'
const stream = new MqttWebSocketStream(new WebSocket(url))
stream.pipe(...).pipe(stream)
```

In browser environment (using Babel/Webpack):

```javascript
import MqttWebSocketStream from 'mqtt-websocket-stream'
const stream = new MqttWebSocketStream(new window.WebSocket(url))
stream.pipe(...).pipe(stream)
```

Passing an async factory:

```javascript
import MqttWebSocketStream from 'mqtt-websocket-stream'
const stream = new MqttWebSocketStream((callback) => {
  getSignedUrl().then(url => callback(null, new window.WebSocket(url))).catch(callback)
})
stream.pipe(...).pipe(stream)
```

