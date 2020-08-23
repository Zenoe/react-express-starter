import BaseMessage from './BaseMessage'

export const TEXT_MESSAGE='TEXT_MESSAGE';

class TextMessage extends BaseMessage{
  constructor({text, render}) {
    super(TEXT_MESSAGE);
    this.text = text;
    this.render = render;
  }
}

export {TextMessage}
