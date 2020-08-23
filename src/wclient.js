import { w3cwebsocket as Wsocket } from "websocket";

class WClient{
  constructor(ws) {

    // const wclient = new Wsocket('ws://127.0.0.1:8999');
    this.wclient = new Wsocket(ws);
    this.wclient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    this.wclient.onerror = ()=>{
      throw new Error('WebSocket connected failed');
    }
  }

  sendMessage(type, message){
    const finalMessage = {
      type,
      content: message,
      isBroadcast : false,
      sender: 'some guy'
    }
    this.wclient.send( JSON.stringify(finalMessage))
    return new Promise((resolve, reject)=>{
      this.wclient.onmessage = (msg) => {
        console.log('receive message:', msg);
        resolve(msg.data)
      };
      this.wclient.onerror = (error)=>{
        console.log('wclient error:', error);
        reject(error.message)
      }
    })
  }

  close(code, msg){
    this.wclient.close(code, msg)
  }
}

export default WClient
