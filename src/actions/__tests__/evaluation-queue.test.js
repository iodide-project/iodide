import { EvaluationQueue } from "../evaluation-queue";

// small mock for dispatcher.
const dispatcher = () => {};

describe("EvaluationQueue", () => {
  let evalQueue;
  beforeEach(() => {
    evalQueue = new EvaluationQueue();
  });

  it("continues chain of evaluations", () => {
    evalQueue.evaluate({}, dispatcher);
    evalQueue.evaluate({}, dispatcher);
    expect(evalQueue.getQueueSize()).toBe(2);

    evalQueue.continue(1);
    expect(evalQueue.getQueueSize()).toBe(1);
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual(["2"]);

    evalQueue.continue(2);
    expect(evalQueue.getQueueSize()).toBe(0);
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual([]);
  });
  it("stops the evaluationQueue when evalQueue.clear(id) is called", () => {
    evalQueue.evaluate({}, dispatcher);
    evalQueue.evaluate({}, dispatcher);
    evalQueue.evaluate({}, dispatcher); // we will reject this one below (3)
    evalQueue.evaluate({}, dispatcher); // this will never "run"

    expect(evalQueue.getQueueSize()).toBe(4);
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual([
      "1",
      "2",
      "3",
      "4"
    ]);

    evalQueue.continue(1);
    expect(evalQueue.getQueueSize()).toBe(3);
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual(["2", "3", "4"]);

    evalQueue.continue(2);
    expect(evalQueue.getQueueSize()).toBe(2);
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual(["3", "4"]);

    evalQueue.clear(3);
    expect(evalQueue.getQueueSize()).toBe(0);
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual([]);
  });
});
