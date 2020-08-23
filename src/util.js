import TextMessage from './component/message/ui/TextMessage'
import ImageMessage from './component/message/ui/ImageMessage'
import SystemMessage from './component/message/ui/SystemMessage'

import {TEXT_MESSAGE, IMAGE_MESSAGE, SYSTEM_MESSAGE} from './component/message/messageType'

import {createMessage} from './component/message/messageFactory'

export function isObj(obj){
    return !!obj && obj === Object(obj)
}

export function delay(ms){
  return new Promise((resolve)=>setTimeout(resolve, ms))
}

/*
 * yyyy-mm-dd h:MM:ss
 */
export function formatDate(date){
  if(date instanceof Date === false){
    return ''
  }

  return date.toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '')     // delete the dot and everything after
}

export function log(message, level='info'){
  //
  console.log(`[${level}] [${formatDate(new Date())}] ${message}`);
}

export function createSystemMessage(text, level){
  return createMessage(
    SYSTEM_MESSAGE,
    {
      text,
      render: SystemMessage,
      level
    }
  )
}

export function createTextMessage(text){
  return createMessage(
    TEXT_MESSAGE,
    {
      text,
      render: TextMessage,
    }
  )
}

export function createImageMessage(src){
  return createMessage(
    IMAGE_MESSAGE,
    {
      src,
      render: ImageMessage,
    }
  )
}

export function createMessageBaseServerMsg(svrMsg){
  if(svrMsg){
    switch(svrMsg.type){
      case TEXT_MESSAGE:
        return createTextMessage(`${svrMsg.sender}: ${svrMsg.content}`)
      case SYSTEM_MESSAGE:
        return createSystemMessage(svrMsg.content, svrMsg.level)
      case IMAGE_MESSAGE:
        {
          console.log('IMAGE_MESSAGE', svrMsg);
          const buffer = svrMsg.content.data;
          const blob = new Blob([new Uint8Array(buffer, 0, buffer.length)]);
          // const blob = new Blob([ svrMsg.content.data ], {type:'image/png'})
          const src = URL.createObjectURL(blob);
          return createImageMessage(src)
        }
      default:
        return null;
    }
  }
  return null;
}
