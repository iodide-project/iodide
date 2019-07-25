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
    this.currentMessageId = 0;
    this.messagesAwaitingResponse = {};
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

  nextMessageId() {
    this.currentMessageId += 1;
    return String(this.currentMessageId);
  }

  async postMessageAndAwaitResponse(messageType, message) {
    const messageId = this.nextMessageId();
    this.postMessageQueueManager.sendMsg(messageType, message, messageId);
    return new Promise((resolve, reject) => {
      this.messagesAwaitingResponse[messageId] = { resolve, reject };
    });
  }

  handleMessageResponse(responseStatus, messageId, message) {
    if (responseStatus === "SUCCESS") {
      this.messagesAwaitingResponse[messageId].resolve(message);
    } else if (responseStatus === "ERROR") {
      this.messagesAwaitingResponse[messageId].reject(message);
    } else {
      console.error({
        responseStatus,
        messageId,
        message
      });
      throw new TypeError('responseStatus must be "SUCCESS" or "ERROR"');
    }
  }

  dispatch(...params) {
    this.dispatchQueueManager.sendMsg(...params);
  }
}

const messagePasser = new MessagePasser();
export default messagePasser;
