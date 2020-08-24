import {TEXT_MESSAGE, IMAGE_MESSAGE, SYSTEM_MESSAGE} from './messageType'

import {SystemMessage} from './SystemMessage'
import {TextMessage} from './TextMessage'
import {ImageMessage} from './ImageMessage'

import TextMessageUI from './ui/TextMessage'
import ImageMessageUI from './ui/ImageMessage'
import SystemMessageUI from './ui/SystemMessage'

/*
 * typs: is string value, indicates message type
 * prop: an object contains properties for the specified message type
 */
function createMessage(type, prop){
  if(type === TEXT_MESSAGE){
    return new TextMessage(prop)
  }
  if(type === SYSTEM_MESSAGE){
    return new SystemMessage(prop)
  }
  if(type === IMAGE_MESSAGE){
    return new ImageMessage(prop)
  }

  throw Error('unknown message type')
}

// function registerNewMessage(type, ...props) {

// }

export function createSystemMessage(text, level){
  return createMessage(
    SYSTEM_MESSAGE,
    {
      text,
      render: SystemMessageUI,
      level
    }
  )
}

export function createTextMessage(text){
  return createMessage(
    TEXT_MESSAGE,
    {
      text,
      render: TextMessageUI,
    }
  )
}

export function createImageMessage(src){
  return createMessage(
    IMAGE_MESSAGE,
    {
      src,
      render: ImageMessageUI,
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
