// import TextMessage from './component/message/ui/TextMessage'
// import ImageMessage from './component/message/ui/ImageMessage'
// import SystemMessage from './component/message/ui/SystemMessage'

// import {TEXT_MESSAGE, IMAGE_MESSAGE, SYSTEM_MESSAGE} from './component/message/messageType'

// import {createMessage} from './component/message/messageFactory'

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

