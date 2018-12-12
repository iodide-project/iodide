import { IdFactory } from '../actions/history-id-generator'

export const evalIdGenerator = new IdFactory()

let evaluationQueue = Promise.resolve()
let evaluationResolvers = {}
let queueSize = 0

const awaitEvaluationResponse = evalId => () => new Promise((resolve, reject) => {
  evaluationResolvers[evalId] = { resolve, reject }
})
export const resolveEvaluation = (evalId) => {
  evaluationResolvers[evalId].resolve()
  queueSize -= 1
  delete evaluationResolvers[evalId]
  return Promise.resolve()
}
export const rejectEvaluation = (evalId) => {
  evaluationResolvers[evalId].reject()
  delete evaluationResolvers[evalId]
  evaluationResolvers = {}
  queueSize = 0
  evaluationQueue = Promise.resolve()
  return Promise.resolve()
}

export const appendChunkToEvaluationQueue = (chunk, dispatchFunction) => {
  const evalId = evalIdGenerator.nextId()
  queueSize += 1
  evaluationQueue = evaluationQueue
    .then(() => {
      const chunkAndId = Object.assign({}, chunk, { evalId })
      dispatchFunction(chunkAndId)
    })
    .then(awaitEvaluationResponse(evalId))
  return evaluationQueue
}

// for testing

export const getEvaluationQueue = () => evaluationQueue
export const getEvaluationResolvers = () => evaluationResolvers
export const getQueueSize = () => queueSize
