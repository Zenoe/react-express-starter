import {SystemMessage, SYSTEM_MESSAGE} from './SystemMessage'
import {TextMessage, TEXT_MESSAGE} from './TextMessage'
import {ImageMessage, IMAGE_MESSAGE} from './ImageMessage'

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
export { createMessage, SYSTEM_MESSAGE, TEXT_MESSAGE, IMAGE_MESSAGE }
