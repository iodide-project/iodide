import { call, take, flush } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import { throwError, dynamic } from "redux-saga-test-plan/providers";

import {
  evaluateCurrentQueue,
  evaluateByType,
  loadKnownLanguage,
  triggerEvalFrameTask,
  sendTaskToEvalFrame
} from "../eval-queue-saga";
import {
  loadingLanguageConsoleMsg,
  addInputToConsole
} from "../console-message-actions";

// this string is the returnValue from a saga was still running when
// it was timed out by redux-test-plan
const RUNNING_AT_TIMEOUT = "@@redux-saga/TASK_CANCEL";

function purifiedMessage(messageAction) {
  // set up message action template and drop keys that are impure
  const action = Object.assign({}, messageAction);
  delete action.historyId;
  delete action.lastRan;
  return { action };
}

// =================================

describe("triggerEvalFrameTask test", () => {
  const taskType = "A_TASK";
  const payload = "PAYLOAD";
  const taskId = "TASK_ID";
  let taskResponse;

  beforeEach(() => {
    taskResponse = { status: "not_ERROR" };
  });

  it("always sends task to eval frame", async () => {
    const expectSagaOutcome = await expectSaga(
      triggerEvalFrameTask,
      taskType,
      payload
    )
      .provide([
        [call(sendTaskToEvalFrame, taskType, payload), taskId],
        [take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`), taskResponse]
      ])
      .call(sendTaskToEvalFrame, taskType, payload)
      .run();

    expect(expectSagaOutcome);
  });

  it("throws correctly if EVAL_FRAME_TASK_RESPONSE action is 'ERROR'", async () => {
    taskResponse = { status: "ERROR" };
    // need to suppress console.error b/c saga uses it internally somehow
    console.error = jest.fn();

    await expectSaga(triggerEvalFrameTask, taskType, payload)
      .provide([
        [call(sendTaskToEvalFrame, taskType, payload), taskId],
        [take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`), taskResponse]
      ])
      .dispatch(`EVAL_FRAME_TASK_RESPONSE-${taskId}`)
      .run()
      .catch(e =>
        expect(e.message).toBe(`EVAL_FRAME_TASK_RESPONSE-${taskId}-FAILED`)
      );

    // this means that the console.error mock was called
    expect(console.error).toHaveBeenCalled();
  });

  it("returns status if EVAL_FRAME_TASK_RESPONSE action is not 'ERROR'", async () => {
    await expectSaga(triggerEvalFrameTask, taskType, payload)
      .provide([
        [call(sendTaskToEvalFrame, taskType, payload), taskId],
        [take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`), taskResponse]
      ])
      .dispatch(`EVAL_FRAME_TASK_RESPONSE-${taskId}`)
      .returns(taskResponse.status)
      .run();
  });

  it("never finishes if no EVAL_FRAME_TASK_RESPONSE is dispatched", async () => {
    const expectSagaOutcome = await expectSaga(
      triggerEvalFrameTask,
      taskType,
      payload
    )
      .provide([[call(sendTaskToEvalFrame, taskType, payload), taskId]])
      .silentRun();
    expect(expectSagaOutcome.returnValue).toBe(RUNNING_AT_TIMEOUT);
  });
});

// =================================

describe("loadKnownLanguage test", async () => {
  it("dispatches loading message and triggers eval frame task", () => {
    const displayName = "a_language";
    const languageId = "al";

    return expectSaga(loadKnownLanguage, displayName, languageId)
      .provide([
        [
          call(triggerEvalFrameTask, "LOAD_KNOWN_LANGUAGE", languageId),
          "mock_return_value"
        ]
      ])
      .put.like(purifiedMessage(loadingLanguageConsoleMsg(displayName)))
      .call(triggerEvalFrameTask, "LOAD_KNOWN_LANGUAGE", languageId)
      .run();
  });
});

// =================================

describe("evaluateByType test", () => {
  let evalType;
  const evalText = "some code to eval";
  let state;
  let evalTaskType;

  beforeEach(() => {
    evalType = "LANGUAGE_ID";
    state = {
      languageDefinitions: {
        [evalType]: { displayName: "LANG_NAME", languageId: evalType }
      },
      loadedLanguages: { [evalType]: "DUMMY" }
    };
  });

  it("call loadKnownLanguage if lang NOT loaded", async () => {
    // overwrite loaded status of evalType
    state.loadedLanguages = {};
    await expectSaga(evaluateByType, evalType, evalText)
      .withState(state)
      .call(loadKnownLanguage, "LANG_NAME", evalType)
      .silentRun();
  });

  it("if lang NOT loaded, but loads ok, add input to console", async () => {
    // overwrite loaded status of evalType
    state.loadedLanguages = {};
    await expectSaga(evaluateByType, evalType, evalText)
      .withState(state)
      .provide([
        [call(loadKnownLanguage, "LANG_NAME", evalType), "load lang ok"]
      ])
      .call(loadKnownLanguage, "LANG_NAME", evalType)
      .put.like(purifiedMessage(addInputToConsole(evalText, evalType)))
      .silentRun();
  });

  it("if lang pre-loaded don't call loadKnownLanguage", async () => {
    await expectSaga(evaluateByType, evalType, evalText)
      .withState(state)
      .not.call(loadKnownLanguage, "LANG_NAME", evalType)
      .silentRun();
  });

  it("if lang pre-loaded, add input to console", async () => {
    await expectSaga(evaluateByType, evalType, evalText)
      .withState(state)
      .put.like(purifiedMessage(addInputToConsole(evalText, evalType)))
      .silentRun();
  });

  [
    ["plugin", "EVAL_LANGUAGE_PLUGIN"],
    ["fetch", "EVAL_FETCH"],
    ["any_other_language", "EVAL_CODE"]
  ].forEach(evalTypeCase => {
    [evalType, evalTaskType] = evalTypeCase;
    it(`if evalType ok, trigger correct eval frame action for ${evalType}`, async () => {
      await expectSaga(evaluateByType, evalType, evalText)
        .withState(state)
        .call(triggerEvalFrameTask, evalTaskType, evalText)
        .silentRun();
    });
  });
});

// ====================================

function mockChunk(type, text) {
  return { chunkType: type, chunkContent: text };
}

describe("evaluateCurrentQueue test", () => {
  const evalType = "js";

  it("if no errors, calls evalChunk on all items dispatched", () => {
    return expectSaga(evaluateCurrentQueue)
      .provide([
        [call(evaluateByType, evalType, 1), "ok"],
        [call(evaluateByType, evalType, 22), "ok"],
        [call(evaluateByType, evalType, 333), "ok"]
      ])
      .call(evaluateByType, evalType, 1)
      .call(evaluateByType, evalType, 22)
      .call(evaluateByType, evalType, 333)
      .dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk: mockChunk(evalType, 1) })
      .dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk: mockChunk(evalType, 22) })
      .dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk: mockChunk(evalType, 333) })
      .dispatch({ type: "BEGIN_EVAL" }) // FIXME remove this
      .silentRun();
  });

  it.skip("if an eval errors, evals queued after that one are NOT evaled", async () => {
    const T0 = Date.now();
    const T = () => (Date.now() - T0) / 1000;
    const error = new Error("ERROR DURING CHUNK EVAL");

    const delay = ms => () =>
      new Promise(resolve => {
        console.log("inside a delay");
        setTimeout(resolve, ms);
      });

    return expectSaga(evaluateCurrentQueue)
      .provide({
        async call({ fn, args }, next) {
          if (fn === evaluateByType) {
            await delay(500);
            if (args[1] === 22) {
              console.log("call ABOUT TO THROW", args[1], T());
              throw error;
            }
            console.log("call returning ok", args[1], T());
            return args[1];
          }

          return next();
        }
      })
      .call(evaluateByType, evalType, 1)
      .call(evaluateByType, evalType, 22)
      .not.call(evaluateByType, evalType, 333)
      .not.call(evaluateByType, evalType, 4444)
      .dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk: mockChunk(evalType, 1) })
      .dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk: mockChunk(evalType, 22) })
      .dispatch({
        type: "ADD_TO_EVAL_QUEUE",
        chunk: mockChunk(evalType, 333)
      })
      .dispatch({
        type: "ADD_TO_EVAL_QUEUE",
        chunk: mockChunk(evalType, 4444)
      })
      .dispatch({ type: "BEGIN_EVAL" })
      .run(1000);
  });

  it.skip("if an eval errors, evals queued after that one are NOT evaled", async () => {
    const error = new Error("ERROR DURING CHUNK EVAL");

    return (
      expectSaga(evaluateCurrentQueue)
        .provide([
          [call(evaluateByType, evalType, 1), "ok1"],
          [call(evaluateByType, evalType, 22), throwError(error)],
          [call(evaluateByType, evalType, 333), "ok33"],
          [call(evaluateByType, evalType, 4444), "ok4444"]
        ])
        .call(evaluateByType, evalType, 1)
        .call(evaluateByType, evalType, 22)
        .not.call(evaluateByType, evalType, 333)
        .not.call(evaluateByType, evalType, 4444)
        .dispatch({
          type: "ADD_TO_EVAL_QUEUE",
          chunk: mockChunk(evalType, 1)
        })
        .dispatch({
          type: "ADD_TO_EVAL_QUEUE",
          chunk: mockChunk(evalType, 22)
        })
        .dispatch({
          type: "ADD_TO_EVAL_QUEUE",
          chunk: mockChunk(evalType, 333)
        })
        .dispatch({
          type: "ADD_TO_EVAL_QUEUE",
          chunk: mockChunk(evalType, 4444)
        })
        // .dispatch({ type: "BEGIN_EVAL" })
        .run(1000)
    );
  });

  // it("was PASSING if an eval errors, evals queued after that one are NOT evaled", async () => {
  //   const error = new Error("ERROR DURING CHUNK EVAL");

  //   return expectSaga(evaluateCurrentQueue)
  //     .provide([
  //       [call(evaluateByType, evalType, 1), "ok1"],
  //       [call(evaluateByType, evalType, 22), throwError(error)],
  //       [call(evaluateByType, evalType, 333), "ok33"],
  //       [call(evaluateByType, evalType, 4444), "ok4444"]
  //     ])
  //     .call(evaluateByType, evalType, 1)
  //     .call(evaluateByType, evalType, 22)
  //     .not.call(evaluateByType, evalType, 333)
  //     .not.call(evaluateByType, evalType, 4444)
  //     .dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk: mockChunk(evalType, 1) })
  //     .dispatch({ type: "ADD_TO_EVAL_QUEUE", chunk: mockChunk(evalType, 22) })
  //     .dispatch({
  //       type: "ADD_TO_EVAL_QUEUE",
  //       chunk: mockChunk(evalType, 333)
  //     })
  //     .dispatch({
  //       type: "ADD_TO_EVAL_QUEUE",
  //       chunk: mockChunk(evalType, 4444)
  //     })
  //     .dispatch({ type: "BEGIN_EVAL" })
  //     .run(1000);
  // });
});
