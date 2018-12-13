import { EvaluationQueue } from '../evaluation-queue'

// small mock for dispatcher.
const dispatcher = () => {}

describe('EvaluationQueue', () => {
  it('resolves a single evaluation', () => {
    const evalQueue = new EvaluationQueue()
    evalQueue.evaluate({}, dispatcher)
    expect(evalQueue.getQueueSize()).toBe(1)
    evalQueue.resolveEvaluation(1)
    expect(evalQueue.getQueueSize()).toBe(0)
  })
  it('resolves a chain of evaluations', () => {
    const evalQueue = new EvaluationQueue()

    evalQueue.evaluate({}, dispatcher)
    evalQueue.evaluate({}, dispatcher)
    expect(evalQueue.getQueueSize()).toBe(2)


    evalQueue.resolveEvaluation(1)

    expect(evalQueue.getQueueSize()).toBe(1)
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual(['2'])

    evalQueue.resolveEvaluation(2)

    expect(evalQueue.getQueueSize()).toBe(0)
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual([])
  })
  it('stops the evaluationQueue when rejectEvaluation is called', () => {
    const evalQueue = new EvaluationQueue()

    evalQueue.evaluate({}, dispatcher)
    evalQueue.evaluate({}, dispatcher)
    evalQueue.evaluate({}, dispatcher) // we will reject this one below (3)
    evalQueue.evaluate({}, dispatcher) // this will never "run"

    expect(evalQueue.getQueueSize()).toBe(4)
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual(['1', '2', '3', '4'])

    evalQueue.resolveEvaluation(1)
    expect(evalQueue.getQueueSize()).toBe(3)
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual(['2', '3', '4'])

    evalQueue.resolveEvaluation(2)
    expect(evalQueue.getQueueSize()).toBe(2)
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual(['3', '4'])

    evalQueue.rejectEvaluation(3)
    expect(evalQueue.getQueueSize()).toBe(0)
    expect(Object.keys(evalQueue.evaluationResolvers)).toEqual([])
  })
})
