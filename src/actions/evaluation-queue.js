import { IdFactory } from './id-generators'

export class EvaluationQueue {
  constructor() {
    this.queue = Promise.resolve()
    this.queueSize = 0
    this.evaluationResolvers = {}
    this.idGenerator = new IdFactory()
  }

  evaluate(chunk, dispatch) {
    const evalId = this.idGenerator.nextId()
    this.queueSize += 1

    const evaluationResolver = new Promise((resolve, reject) => {
      this.evaluationResolvers[evalId] = { resolve, reject }
    })

    this.queue = this.queue
      .then(() => {
        const evalAction = Object.assign({}, {
          type: 'TRIGGER_TEXT_EVAL_IN_FRAME',
          evalText: chunk.chunkContent,
          evalType: chunk.chunkType,
          evalFlags: chunk.evalFlags,
          chunkId: chunk.chunkId,
          evalId,
        })
        dispatch(evalAction)
      })
      .then(() => evaluationResolver)
    return this
  }

  reset() {
    this.evaluationResolvers = {}
    this.queueSize = 0
    this.queue = Promise.resolve()
    return this
  }

  resolveEvaluation(evalId) {
    this.evaluationResolvers[evalId].resolve()
    this.queueSize -= 1
    delete this.evaluationResolvers[evalId]
  }

  rejectEvaluation(evalId) {
    this.evaluationResolvers[evalId].reject()
    this.reset()
    return this
  }

  getQueueSize() {
    return this.queueSize
  }
}

const EQ = new EvaluationQueue()
export default EQ
