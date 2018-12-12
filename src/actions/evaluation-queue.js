import { IdFactory } from '../actions/history-id-generator'

export const evalIdGenerator = new IdFactory()

let evaluationQueue = Promise.resolve()
let evaluationResolvers = {}

export const awaitEvaluationResponse = evalId => () => new Promise((resolve, reject) => {
  evaluationResolvers[evalId] = { resolve, reject }
})
export const resolveEvaluation = (evalId) => {
  evaluationResolvers[evalId].resolve()
  delete evaluationResolvers[evalId]
}
export const rejectEvaluation = (evalId) => {
  evaluationResolvers[evalId].reject()
  evaluationResolvers = {}
  evaluationQueue = Promise.resolve()
}

export const appendToEvaluationQueue = (chunk, dispatchFunction) => {
  const evalId = evalIdGenerator.nextId()
  evaluationQueue = evaluationQueue
    .then(() => {
      const chunkAndId = Object.assign({}, chunk, { evalId })
      dispatchFunction(chunkAndId)
    })
    .then(awaitEvaluationResponse(evalId))
  return evaluationQueue
}
