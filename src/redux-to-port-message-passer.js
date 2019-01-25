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
    this.reduxManager = new MessageQueueManager();
    this.portManager = new MessageQueueManager();
  }

  addPostMessage(postMessage) {
    this.portManager.addMsgFn(postMessage);
    // this.postMessage =
  }
  addDispatch(dispatch) {
    this.reduxManager.addMsgFn(dispatch);
  }

  postMessage(...params) {
    this.portManager.sendMsg(...params);
  }
  dispatchToRedux(...params) {
    this.reduxManager.sendMsg(...params);
  }
}

const messagePasser = new MessagePasser();
export default messagePasser;
