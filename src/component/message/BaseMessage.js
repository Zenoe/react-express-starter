export default class BaseMessage{
  constructor(type){
    this.type = type;
    this.timeStamp = new Date().getTime();
    this.render = null;
  }
}
