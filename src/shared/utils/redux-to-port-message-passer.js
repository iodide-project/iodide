// this file is used in both the editor and eval frame
// IT IS NEVER ALLOWED TO IMPORT ANY OTHER FILES FROM IODIDE
// or it might break it's singleton-ness on each side of the app

export class MessageQueueManager {
  constructor() {
    this.msgFn = null;
    this.msgQueue = null;
  }

  addMsgFn(msgFn) {
    this.msgFn = msgFn;
    if (this.msgQueue) {
      this.msgQueue.forEach(m => this.msgFn(...m));
      this.msgQueue = null;
    }
  }

  sendMsg(...msg) {
    if (this.msgFn) {
      this.msgFn(...msg);
    } else if (this.msgQueue) {
      this.msgQueue.push(msg);
    } else {
      this.msgQueue = [msg];
    }
  }
}

export class MessagePasser {
  constructor() {
    this.dispatchQueueManager = new MessageQueueManager();
    this.postMessageQueueManager = new MessageQueueManager();
  }

  connectPostMessage(postMessage) {
    this.postMessageQueueManager.addMsgFn(postMessage);
  }
  connectDispatch(dispatch) {
    this.dispatchQueueManager.addMsgFn(dispatch);
  }

  postMessage(...params) {
    this.postMessageQueueManager.sendMsg(...params);
  }
  dispatch(...params) {
    this.dispatchQueueManager.sendMsg(...params);
  }
}

const messagePasser = new MessagePasser();
export default messagePasser;
