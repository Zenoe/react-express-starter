const express = require('express');
const http = require('http')
const WebSocket = require('ws')
const fs = require('fs')

const SYSTEM_MESSAGE='SYSTEM_MESSAGE';
const TEXT_MESSAGE='TEXT_MESSAGE';
const IMAGE_MESSAGE='IMAGE_MESSAGE';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });


class Message {
  constructor(type, content, isBroadcast = false, sender)
  {
    this.type = type;
    this.content = content;
    this.isBroadcast = isBroadcast;
    this.sender=sender;
  }
}

function createMessage(type, content, isBroadcast = false, sender = 'WebSocketSever') {
    return JSON.stringify(new Message(type, content, isBroadcast, sender));
}

wss.on('connection', ws => {
    const extWs = ws;
    extWs.isAlive = true;
    ws.on('pong', () => {
        extWs.isAlive = true;
    });

    //connection is up, let's add a simple simple event
    ws.on('message', msg => {
        console.log('receive msg:', msg);
        const message = JSON.parse(msg);
        setTimeout(() => {
            if (message.isBroadcast) {
              if(message.type === TEXT_MESSAGE){
                //send back the message to the other clients
                wss.clients
                   .forEach(client => {
                     if (client !== ws) {
                       client.send(createMessage(TEXT_MESSAGE, message.content, false, message.sender));
                     }
                   });
              }
            }
          if(message.type === TEXT_MESSAGE){
            ws.send(createMessage(TEXT_MESSAGE, `You sent -> ${message.content}`, message.isBroadcast));
          } else if(message.type === IMAGE_MESSAGE){
            fs.readFile(`${__dirname}/asset/socket.png`, function(err, data){
              ws.send(createMessage(IMAGE_MESSAGE, data))
            })
            // todo send stream with websocket
          }
        }, 10);
    });

  // ws.send(createMessage(TEXT_MESSAGE, 'Hi there, I am a WebSocket server'));

    ws.on('error', (err) => {
        console.warn(`Client disconnected - reason: ${err}`);
    })
});

setInterval(() => {
    wss.clients.forEach((ws) => {

        const extWs = ws;

        if (!extWs.isAlive) return ws.terminate();

        extWs.isAlive = false;
        ws.ping(null, undefined);
    });
}, 10000);

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
