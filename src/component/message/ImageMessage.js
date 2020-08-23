import BaseMessage from './BaseMessage'

export const IMAGE_MESSAGE='IMAGE_MESSAGE';

class ImageMessage extends BaseMessage{
  constructor({src, render}) {
    super(IMAGE_MESSAGE);
    this.render =render;
    this.src = src;
  }
}

export {ImageMessage}
