import {TEXT_MESSAGE, IMAGE_MESSAGE, SYSTEM_MESSAGE} from './messageType'

import {SystemMessage} from './SystemMessage'
import {TextMessage} from './TextMessage'
import {ImageMessage} from './ImageMessage'

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
export { createMessage }
