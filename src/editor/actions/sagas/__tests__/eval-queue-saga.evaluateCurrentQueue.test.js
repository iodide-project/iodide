// import { call } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
// import { throwError } from "redux-saga-test-plan/providers";

import { setKernelState } from "../../eval-actions";

import { evaluateCurrentQueue, evaluateByType } from "../eval-queue-saga";

function mockChunk(type, text, id) {
  return { chunkType: type, chunkContent: text, chunkId: id };
}
function mockAddToEvalQueueAction(type, text, id) {
  return { type: "ADD_TO_EVAL_QUEUE", chunk: mockChunk(type, text, id) };
}

describe("evaluateCurrentQueue test", () => {
  let evalType = "js";

  beforeEach(() => {
    evalType = "js";
  });

  it("if no errors, calls evaluateByType on all items dispatched", async () => {
    const chunkContent = "foo";
    await expectSaga(evaluateCurrentQueue)
      .call(evaluateByType, evalType, chunkContent, 1)
      .call(evaluateByType, evalType, chunkContent, 2)
      .call(evaluateByType, evalType, chunkContent, 3)
      .put(setKernelState("KERNEL_BUSY"))
      .put(setKernelState("KERNEL_BUSY"))
      .put(setKernelState("KERNEL_BUSY"))
      .put(setKernelState("KERNEL_IDLE"))
      .put(setKernelState("KERNEL_IDLE"))
      .put(setKernelState("KERNEL_IDLE"))
      .dispatch(mockAddToEvalQueueAction(evalType, chunkContent, 1))
      .dispatch(mockAddToEvalQueueAction(evalType, chunkContent, 2))
      .dispatch(mockAddToEvalQueueAction(evalType, chunkContent, 3))
      .silentRun();
  });

  // FIXME we need to fully test when an eval errors,
  // but it's not really possible with redux-saga-test-plan
  // https://github.com/jfairbank/redux-saga-test-plan/issues/247

  // LEAVE THIS CODE UNTIL WE FIGURE IT OUT

  //   it.skip("if an eval errors, evals queued after that one are NOT evaled", async () => {
  //     evalType = "fetch";
  //     const state = {
  //       languageDefinitions: {
  //         [evalType]: { displayName: "LANG_NAME", languageId: evalType }
  //       },
  //       loadedLanguages: { [evalType]: "DUMMY" }
  //     };
  //     const chunkContent = "foo";
  //     const error = new Error("ERROR DURING CHUNK EVAL");
  //     const sagaResult = await expectSaga(evaluateCurrentQueue)
  //       .withState(state)
  //       .provide([
  //         [
  //           call(triggerEvalFrameTask, "EVAL_FETCH", { fetchText: chunkContent }),
  //           throwError(error)
  //         ],
  //         [call(updateUserVariables), "ok"]
  //       ])
  //       .call(evaluateByType, evalType, chunkContent, 1)
  //       .call(evaluateByType, evalType, chunkContent, 2)
  //       .call(evaluateByType, evalType, chunkContent, 3)
  //       .dispatch(mockAddToEvalQueueAction(evalType, chunkContent, 1))
  //       .dispatch(mockAddToEvalQueueAction(evalType, chunkContent, 2))
  //       .dispatch(mockAddToEvalQueueAction(evalType, chunkContent, 3))
  //       .silentRun();

  //     console.log("sagaResult.effects");
  //     console.log(sagaResult.effects);
  //     console.log("sagaResult.allEffects 333");
  //     console.log(sagaResult.allEffects);
  //     let effectString = "";
  //     sagaResult.allEffects.forEach(effect => {
  //       effectString += `
  //     type: ${effect.type}    ${
  //         effect.payload.fn ? "\n  fn: " + effect.payload.fn.name : ""
  //       } ${
  //         effect.payload.args
  //           ? "\n  args: " + JSON.stringify(effect.payload.args)
  //           : ""
  //       } ${
  //         effect.payload.action
  //           ? "\n  action: " + JSON.stringify(effect.payload.action)
  //           : ""
  //       } ${
  //         effect.payload.pattern
  //           ? "\n  pattern: " + JSON.stringify(effect.payload.pattern)
  //           : ""
  //       }
  //         `;
  //     });
  //     console.log(effectString);
  //   });

  //   it.skip("if an eval errors, evals queued after that one are NOT evaled", async () => {
  //     const T0 = Date.now();
  //     const T = () => (Date.now() - T0) / 1000;
  //     const error = new Error("ERROR DURING CHUNK EVAL");
  //     const chunkContent = "foo";

  //     const delay = () =>
  //       new Promise(resolve => {
  //         console.log("inside a delay");
  //         setTimeout(resolve, 500);
  //       });

  //     const logDispatchTime = x => {
  //       console.log("dispatch time", T());
  //       return x;
  //     };

  //     const sagaResult = await expectSaga(evaluateCurrentQueue)
  //       .provide({
  //         async call({ fn, args }, next) {
  //           if (fn === evaluateByType) {
  //             await delay();
  //             if (args[2] === 2) {
  //               console.log("call ABOUT TO THROW", args[1], T());
  //               throw error;
  //             }
  //             console.log("call returning ok", args[1], T());
  //             return args[1];
  //           }

  //           return next();
  //         }
  //       })
  //       .dispatch(
  //         logDispatchTime(mockAddToEvalQueueAction(evalType, chunkContent, 1))
  //       )
  //       .dispatch(
  //         logDispatchTime(mockAddToEvalQueueAction(evalType, chunkContent, 2))
  //       )
  //       .dispatch(
  //         logDispatchTime(mockAddToEvalQueueAction(evalType, chunkContent, 3))
  //       )
  //       .run(3000);

  //     console.log("sagaResult.allEffects 4444");
  //     console.log(sagaResult.allEffects);
  //     let effectString = "";
  //     sagaResult.allEffects.forEach(effect => {
  //       effectString += `
  // type: ${effect.type}    ${
  //         effect.payload.fn ? "\n  fn: " + effect.payload.fn.name : ""
  //       } ${
  //         effect.payload.args
  //           ? "\n  args: " + JSON.stringify(effect.payload.args)
  //           : ""
  //       } ${
  //         effect.payload.action
  //           ? "\n  action: " + JSON.stringify(effect.payload.action)
  //           : ""
  //       } ${
  //         effect.payload.pattern
  //           ? "\n  pattern: " + JSON.stringify(effect.payload.pattern)
  //           : ""
  //       }
  //     `;
  //     });
  //     console.log(effectString);
  //   });
});
