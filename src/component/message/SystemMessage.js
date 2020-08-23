import BaseMessage from './BaseMessage'

export const SYSTEM_MESSAGE='SYSTEM_MESSAGE';

/*
 * level: info, warn, error
 */
class SystemMessage extends BaseMessage{
  constructor({text, render, level='info'}) {
    super(SYSTEM_MESSAGE);
    this.text = text;
    this.level = level;
    this.render = render;
  }
}

export {SystemMessage}
