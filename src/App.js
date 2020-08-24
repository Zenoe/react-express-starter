import React, {useState, useEffect, useRef } from 'react';
import './App.css';
import WClient from './wclient'
import {log, isObj, delay, } from './util'
import MsgWindow from './component/msgwindow'

import {TEXT_MESSAGE, IMAGE_MESSAGE} from './component/message/messageType'
import {createMessageBaseServerMsg, createTextMessage, createSystemMessage, createImageMessage} from './component/message/messageFactory'

function App(){

  const arrImgUrl = []

  const maxMsgSize = 100


  const [wclient, setWclient] = useState(null)

  const [ messagetosend, setMessagetosend ] = useState('')

  const [ arrMsg, setArrMsg ] = useState([])
  const arrMsgRef = useRef(null);
  arrMsgRef.current = arrMsg;

  /*
   * When addNewMsg function is called in an asynchrous or so call callback function
   * it couldn't get the latest arrMsg due to how closure work in javascript. the value
   * of arrMsg is given in the initial render phase, when it is intact
   * So I use arrMsgRef to refer the latest arrMsg
   */
  const addNewMsg = (msgObj) =>{
    if(isObj(msgObj) && msgObj !== null ){
      // const arrMsgNew = arrMsg.concat(Array.isArray(msgObj) ? msgObj : [ msgObj ])
      const arrMsgNew = arrMsgRef.current.concat(Array.isArray(msgObj) ? msgObj : [ msgObj ])
      if(maxMsgSize < arrMsgNew.length){
        arrMsgNew.shift();
      }
      setArrMsg(arrMsgNew)
    }else{
      log('addNewMsg -> invalid msgObj')
    }
  }

  const connect2WebSocket = (ws) =>{
    try{
      setWclient(new WClient(ws))
    }catch(ex){
      const errMsg = createSystemMessage(ex.message, 'error')
      addNewMsg(errMsg);
    }
  }

  useEffect(()=>{
    if(wclient){
      const sysMsg = createSystemMessage('WebSocket connected!', 'info')
      addNewMsg(sysMsg);
    }
  },[wclient])

  useEffect(()=>{
    connect2WebSocket('ws:172.29.32.10:8999');
    return ()=>{
      arrImgUrl.forEach((it)=>{
        URL.revokeObjectURL(it)
      })

      wclient.close(1000, 'complete');
    }
  }, [])

  // const handleChange = (event) => {
  // cause rerendering everytime the value of input is changed
  //   setMessagetosend(event.target.value)
  // }

  const handleLocaltest = () => {
    // create text message and push to msg array
    const text="[text message] React is an open-source JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications"
    const txtMsg = createTextMessage(text)

    // create system messages and push to msg array
    const sysMsg = createSystemMessage( 'this is a system info message', 'info');
    addNewMsg([ txtMsg, sysMsg ])
    delay(1000).then(
      ()=>{
        addNewMsg(
          createSystemMessage( 'this is a system warning message', 'warn')
        )
      }
    );
  }

  const requestImageFromWs = ()=>{
    log('requestImageFromWs')
    wclient.sendMessage(IMAGE_MESSAGE)
        .then(res=>{
          const severMsg = JSON.parse(res);
          addNewMsg(
            createMessageBaseServerMsg(severMsg)
          )
        })
  }

  const sendTextMessage = ()=>{
    setMessagetosend(event.target.value)
    // if(messagetosend.length === 0){
    //   return;
    // }
    log('sendTextMessage ->', messagetosend)
    wclient.sendMessage(TEXT_MESSAGE, messagetosend)
        .then(res=>{
          const severMsg = JSON.parse(res);
          addNewMsg(
            createMessageBaseServerMsg(severMsg)
          )
        })
  }

  const handleCreateImageMessage = ()=>{
    const reqfilename = 'ringc.png';
    fetch(`/api/getimage/${reqfilename}`)
      .then(response => response.blob())
      .then(
        blob=>{
          const src = URL.createObjectURL(blob)
          arrImgUrl.push(src);
          const imgMsg = createImageMessage(src);
          addNewMsg(imgMsg)
        }
      );
  }

  return (
    <div className="App">
      <header className="App-header">
        <MsgWindow arrMsg={arrMsg} />
        <form>
          <input
            placeholder='please input message'
            id="messageinput"
            type="text"
            /* value={messagetosend} */
            /* onChange={handleChange} */
          />
          <button type="button" onClick={sendTextMessage}>Send</button>
        </form>
        <div className="controlPanel">
          <button type="button" onClick={requestImageFromWs}>Image from WebSocket Sever</button>
          <button type="button" onClick={handleCreateImageMessage}>Image from Http Server</button>
          <button type="button" onClick={handleLocaltest}>Local test</button>
        </div>
      </header>
    </div>
  );
}

export default App;
