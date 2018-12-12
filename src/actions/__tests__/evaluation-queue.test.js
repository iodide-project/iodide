import { getEvaluationResolvers, resolveEvaluation, rejectEvaluation,
  appendToEvaluationQueue, evalIdGenerator, getQueueSize } from '../evaluation-queue'


describe('appendToEvaluationQueue', () => {
  it('appropriately resolves the evaluationQueue', async () => {
    appendToEvaluationQueue({}, () => {})
    // the await below forces the above microtask queue to finish before moving on.
    await Promise.resolve().then(() => {})
    const currentId = evalIdGenerator.state
    const resolvers = getEvaluationResolvers()
    expect(Object.keys(resolvers).length).toBe(1)
    expect(currentId).toBe(1)
    expect(getQueueSize()).toBe(1)
    resolveEvaluation(currentId)
    expect(Object.keys(resolvers).length).toBe(0)
    expect(getQueueSize()).toBe(0)
  })
  it('resolves a chain of evals from the evaluationQueue', async () => {
    appendToEvaluationQueue({}, () => {}) // 2
    appendToEvaluationQueue({}, () => {}) // 3
    await Promise.resolve().then(() => {})
    expect(getQueueSize()).toBe(2)
    resolveEvaluation(2)

    await Promise.resolve().then(() => {})
    expect(getQueueSize()).toBe(1)
    resolveEvaluation(3)

    await Promise.resolve().then(() => {})
    expect(getQueueSize()).toBe(0)

    await Promise.resolve().then(() => {})
  })
  it('stops the evaluationQueue when rejectEvaluation is called', async () => {
    appendToEvaluationQueue({}, () => {}) // 4
    appendToEvaluationQueue({}, () => {}) // 5
    appendToEvaluationQueue({}, () => {}) // 6, REJECT
    appendToEvaluationQueue({}, () => {}) // 7, never called.

    await Promise.resolve().then(() => {})
    let resolvers = getEvaluationResolvers()
    expect(Object.keys(resolvers).length).toBe(1)
    expect(Object.keys(resolvers)).toEqual(['4'])
    expect(getQueueSize()).toBe(4)
    resolveEvaluation(4)

    await Promise.resolve().then(() => {})
    resolvers = getEvaluationResolvers()
    expect(Object.keys(resolvers).length).toBe(1)
    expect(Object.keys(resolvers)).toEqual(['5'])
    expect(getQueueSize()).toBe(3)
    resolveEvaluation(5)

    // this appears to be necessary.
    await Promise.resolve().then(() => {})
    await Promise.resolve().then(() => {})

    resolvers = getEvaluationResolvers()
    expect(Object.keys(resolvers).length).toBe(1)
    expect(Object.keys(resolvers)).toEqual(['6'])
    expect(getQueueSize()).toBe(2)
    rejectEvaluation(6)

    await Promise.resolve().then(() => {})
    resolvers = getEvaluationResolvers()
    expect(getQueueSize()).toBe(0)
    expect(Object.keys(resolvers).length).toBe(0)
    expect(resolvers).toEqual({})
  })
})
