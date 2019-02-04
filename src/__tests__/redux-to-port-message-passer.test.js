import { MessageQueueManager } from "../redux-to-port-message-passer";

describe("MessageQueueManager", () => {
  let mqm;
  beforeEach(() => {
    mqm = new MessageQueueManager();
  });

  it("calling sendMsg before adding msgFn enqueues message params", () => {
    mqm.sendMsg(0);
    mqm.sendMsg(1, 2, 3);
    mqm.sendMsg(4, [5, 6]);
    mqm.sendMsg({ 7: 8, 9: 10 });
    expect(mqm.msgQueue).toEqual([
      [0],
      [1, 2, 3],
      [4, [5, 6]],
      [{ 7: 8, 9: 10 }]
    ]);
  });

  it("adding msgFn after calling sendMsg calls the msgFn with correct params", () => {
    mqm.sendMsg(0);
    mqm.sendMsg(1, 2, 3);
    mqm.sendMsg(4, [5, 6]);
    mqm.sendMsg({ 7: 8, 9: 10 });
    const msgFn = jest.fn();
    mqm.addMsgFn(msgFn);
    expect(msgFn.mock.calls).toEqual([
      [0],
      [1, 2, 3],
      [4, [5, 6]],
      [{ 7: 8, 9: 10 }]
    ]);
    expect(mqm.msgQueue).toBe(null);
  });
});
