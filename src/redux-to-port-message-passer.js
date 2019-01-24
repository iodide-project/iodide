// this file is used in both the editor and eval frame
// IT IS NEVER ALLOWED TO IMPORT ANY OTHER FILES FROM IODIDE
// or it might break it's singleton-ness on each side of the app

class MessageQueueManager {
  constructor() {
    this.msgFn = null;
    this.msgQueue = null;
  }

  addMsgFn(msgFn) {
    this.msgFn = msgFn;
    if (this.msgQueue) {
      this.msgQueue.forEach(m => this.msgFn(m));
      this.msgQueue = null;
    }
  }

  sendMsg(msg) {
    if (this.msgFn) {
      this.msgFn(msg);
    } else if (this.msgQueue) {
      this.msgQueue.push(msg);
    } else {
      this.msgQueue = [msg];
    }
  }
}

class MessagePasser {
  constructor() {
    this.reduxManager = new MessageQueueManager();
    this.portManager = new MessageQueueManager();
  }

  addPostMessage(postMessage) {
    this.portManager.addMsgFn(postMessage);
  }
  postMessage(msg) {
    this.portManager.sendMsg(msg);
  }

  addDispatch(dispatch) {
    this.reduxManager.addMsgFn(dispatch);
  }

  dispatchToRedux(action) {
    this.reduxManager.sendMsg(action);
  }
}

// export default new MessagePasser();
const messagePasser = new MessagePasser();
window.messagePasser = messagePasser;
export default messagePasser;
