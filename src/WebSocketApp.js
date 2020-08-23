import React, { Component } from 'react';
import { w3cwebsocket as Wsocket } from "websocket";

import './App.css';

import {delay} from './util'
import MsgWindow from './component/msgwindow'

import TextMessage from './component/message/ui/TextMessage'
import ImageMessage from './component/message/ui/ImageMessage'
import SystemMessage from './component/message/ui/SystemMessage'


import {TEXT_MESSAGE, IMAGE_MESSAGE, SYSTEM_MESSAGE} from './component/message/messageType'
import {createMessage} from './component/message/messageFactory'

// const wclient = new Wsocket('ws://127.0.0.1:8999');
const wclient = new Wsocket('ws://172.29.32.10:8999');

class App extends Component {

  arrImgUrl = []

  clickCount = 0

  maxMsgSize = 100

  constructor(props) {
    super(props);
    this.state = {
      arrMsg: [],
    };

    this.handleSystemMessage = this.handleSystemMessage.bind(this);
    this.handleCreateTextMessage = this.handleCreateTextMessage.bind(this);
    this.handleCreateImageMessage = this.handleCreateImageMessage.bind(this);
  }

  componentDidMount (){
    wclient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    wclient.onmessage = (message) => {
      console.log(message);
    };
  }

  componentWillUnmount(){
    this.arrImgUrl.forEach((it)=>{
      URL.revokeObjectURL(it)
    })
  }

  addNewMsg(msgObj){
    const {arrMsg} = this.state;
    const dupArrMsg = [...arrMsg];
    if(this.maxMsgSize <= arrMsg.length){
      dupArrMsg.shift();
    }
    dupArrMsg.push(msgObj)
    this.setState({
      arrMsg: dupArrMsg
    } )
  }

  handleSystemMessage (){
    const sysMsg = createMessage(
      SYSTEM_MESSAGE,
      {
        text: 'this is a system info message',
        render: SystemMessage,
        level: 'info'
      }
    )
    this.addNewMsg(sysMsg)
    delay(2000).then(
      ()=>{
        this.addNewMsg(
          createMessage(
            SYSTEM_MESSAGE,
            {
              text: 'this is a system warning message',
              render: SystemMessage,
              level: 'warn'
            }
          )
        )
      }
    );
  }

  handleCreateTextMessage(){
    const text="React is an open-source JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications"
    const txtMsg = createMessage(
      TEXT_MESSAGE,
      {text, render: TextMessage}
    )
    this.addNewMsg(txtMsg)
  }

  handleCreateImageMessage(){
    const imageMessage = ImageMessage;
    this.clickCount += 1
    const reqfilename = this.clickCount % 2 === 0 ? 'react.jpg' : 'ringc.png';
    fetch(`/api/getimage/${reqfilename}`)
      .then(response => response.blob())
      .then(
        blob=>{
          // console.log('blob', blob);
          // const svg = Object.assign({}, blob, {type: 'image/svg+xml'})
          const src = URL.createObjectURL(blob)
          this.arrImgUrl.push(src);
          const imgMsg = createMessage(
            IMAGE_MESSAGE,
            {
              src,
              render: imageMessage
            })
          this.addNewMsg(imgMsg)
        }
      );

  }

  render() {
    const {arrMsg} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <MsgWindow arrMsg={arrMsg} />
          <div className="controlPanel">
            <button type="button" onClick={this.handleSystemMessage}>SystemMessage</button>
            <button type="button" onClick={this.handleCreateTextMessage}>TextMessage</button>
            <button type="button" onClick={this.handleCreateImageMessage}>ImageMessage</button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
