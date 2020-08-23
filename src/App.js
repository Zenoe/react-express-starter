import React, { Component } from 'react';
import './App.css';
import WClient from './wclient'
import {log, isObj, delay, createMessageBaseServerMsg, createTextMessage, createSystemMessage, createImageMessage} from './util'
import MsgWindow from './component/msgwindow'

import {TEXT_MESSAGE, IMAGE_MESSAGE} from './component/message/messageType'

class App extends Component {

  arrImgUrl = []

  clickCount = 0

  maxMsgSize = 100

  wclient = null

  constructor(props) {
    super(props);
    this.state = {
      messagetosend: '',
      arrMsg: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.requestImageFromWs = this.requestImageFromWs.bind(this);
    this.sendTextMessage = this.sendTextMessage.bind(this);
    this.handleCreateImageMessage = this.handleCreateImageMessage.bind(this);
    this.handleLocaltest = this.handleLocaltest.bind(this);
  }

  componentDidMount (){
    try{
      this.wclient = new WClient('ws:172.29.32.10:8999')
      if(this.wclient){
        const errMsg = createSystemMessage('WebSocket connected!', 'info')
        this.addNewMsg(errMsg);
      }
    }catch(ex){
      const errMsg = createSystemMessage(ex.message, 'error')
      this.addNewMsg(errMsg);
    }
  }

  componentWillUnmount(){
    this.arrImgUrl.forEach((it)=>{
      URL.revokeObjectURL(it)
    })

    this.wclient.close(1000, 'complete');
  }

  addNewMsg(msgObj){
    if(isObj(msgObj) && msgObj !== null ){
      const {arrMsg} = this.state;
      const arrMsgNew = arrMsg.concat(Array.isArray(msgObj) ? msgObj : [ msgObj ])
      if(this.maxMsgSize < arrMsgNew.length){
        arrMsgNew.shift();
      }
      this.setState({
        arrMsg: arrMsgNew,
      } )
    }else{
      log('addNewMsg -> invalid msgObj')
    }
  }

  handleChange(event) {
    this.setState({ messagetosend: event.target.value });
  }

  handleLocaltest (){
    // create text message and push to msg array
    const text="[text message] React is an open-source JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications"
    const txtMsg = createTextMessage(text)

    // create system messages and push to msg array
    const sysMsg = createSystemMessage( 'this is a system info message', 'info');
    delay(2000).then(
      ()=>{
        this.addNewMsg(
          createSystemMessage( 'this is a system warning message', 'warn')
        )
      }
    );

    this.addNewMsg([ txtMsg, sysMsg ])
  }

  requestImageFromWs (){
    log('requestImageFromWs')
    this.wclient.sendMessage(IMAGE_MESSAGE)
        .then(res=>{
          const severMsg = JSON.parse(res);
          this.addNewMsg(
            createMessageBaseServerMsg(severMsg)
          )
        })
  }

  sendTextMessage(){
    const {messagetosend} = this.state;
    if(messagetosend.length === 0){
      return;
    }
    log('sendTextMessage ->', messagetosend)
    this.wclient.sendMessage(TEXT_MESSAGE, messagetosend)
        .then(res=>{
          const severMsg = JSON.parse(res);
          this.addNewMsg(
            createMessageBaseServerMsg(severMsg)
          )
        })
  }

  handleCreateImageMessage(){
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
          const imgMsg = createImageMessage(src);
          this.addNewMsg(imgMsg)
        }
      );
  }

  render() {
    const {arrMsg, messagetosend} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <MsgWindow arrMsg={arrMsg} />
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="name">
              <input
                placeholder='please input message'
                id="messageinput"
                type="text"
                value={messagetosend}
                onChange={this.handleChange}
              />
            </label>
            <button type="button" onClick={this.sendTextMessage}>Send</button>
          </form>
          <div className="controlPanel">
            <button type="button" onClick={this.requestImageFromWs}>Image from WebSocket Sever</button>
            <button type="button" onClick={this.handleCreateImageMessage}>Image from Http Server</button>
            <button type="button" onClick={this.handleLocaltest}>Local test</button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
