import { call, take } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import { throwError } from "redux-saga-test-plan/providers";

import {
  evaluateCurrentQueue,
  evaluateByType,
  evaluateLanguagePlugin,
  loadKnownLanguage,
  triggerEvalFrameTask,
  sendTaskToEvalFrame,
  loadLanguagePlugin
} from "../eval-queue-saga";
import {
  loadingLanguageConsoleMsg,
  addInputToConsole,
  evalTypeConsoleError
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
    await expectSaga(triggerEvalFrameTask, taskType, payload)
      .provide([
        [call(sendTaskToEvalFrame, taskType, payload), taskId],
        [take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`), taskResponse]
      ])
      .call(sendTaskToEvalFrame, taskType, payload)
      .run();
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
      .returns(taskResponse)
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
    const languagePlugin = { displayName };

    return expectSaga(loadKnownLanguage, languagePlugin)
      .provide([
        [
          call(triggerEvalFrameTask, "LOAD_KNOWN_LANGUAGE", { languagePlugin }),
          "mock_return_value"
        ]
      ])
      .put.like(purifiedMessage(loadingLanguageConsoleMsg(displayName)))
      .call(loadLanguagePlugin, languagePlugin)
      .run();
  });
});

// =================================

describe("evaluateByType test", () => {
  let evalType = "some_language_id";
  const evalText = "some code to eval";
  let state;
  let evalTaskType;
  const chunkId = "chunk-1";

  beforeEach(() => {
    evalType = "some_language_id";
    state = {
      languageDefinitions: {
        [evalType]: { displayName: "LANG_NAME", languageId: evalType }
      },
      loadedLanguages: { [evalType]: "DUMMY" }
    };
  });

  it("puts message and throws if evalType is not defined'", async () => {
    evalType = "invalidEvalType";
    // need to suppress console.error b/c saga uses it internally somehow
    console.error = jest.fn();

    await expectSaga(evaluateByType, evalType, evalText, chunkId)
      .withState(state)
      .put.like(purifiedMessage(evalTypeConsoleError(evalType)))
      .silentRun()
      .catch(e => expect(e.message).toBe("unknown evalType"));
  });

  it("call loadKnownLanguage if lang NOT loaded", async () => {
    // overwrite loaded status of evalType
    state.loadedLanguages = {};
    await expectSaga(evaluateByType, evalType, evalText, chunkId)
      .withState(state)
      .call(loadKnownLanguage, state.languageDefinitions[evalType])
      .silentRun();
  });

  it("if lang NOT loaded, but loads ok, add input to console", async () => {
    // overwrite loaded status of evalType
    state.loadedLanguages = {};
    await expectSaga(evaluateByType, evalType, evalText, chunkId)
      .withState(state)
      .provide([
        [
          call(loadKnownLanguage, state.languageDefinitions[evalType]),
          "load lang ok"
        ]
      ])
      // .call(loadKnownLanguage, "LANG_NAME", evalType)
      .put.like(purifiedMessage(addInputToConsole(evalText, evalType)))
      .silentRun();
  });

  it("if lang pre-loaded don't call loadKnownLanguage", async () => {
    await expectSaga(evaluateByType, evalType, evalText, chunkId)
      .withState(state)
      .not.call(loadKnownLanguage)
      .silentRun();
  });

  it("if lang pre-loaded, add input to console", async () => {
    await expectSaga(evaluateByType, evalType, evalText, chunkId)
      .withState(state)
      .put.like(purifiedMessage(addInputToConsole(evalText, evalType)))
      .silentRun();
  });

  it(`if evalType ok, trigger correct eval frame action for "plugin"`, async () => {
    evalType = "plugin";
    const pluginText = "{}";
    await expectSaga(evaluateByType, evalType, pluginText, chunkId)
      .withState(state)
      .call(evaluateLanguagePlugin, pluginText)
      .silentRun();
  });

  [["fetch", "EVAL_FETCH"], [evalType, "EVAL_CODE"]].forEach(evalTypeCase => {
    it(`if evalType ok, trigger correct eval frame action for "${
      evalTypeCase[0]
    }"`, async () => {
      [evalType, evalTaskType] = evalTypeCase;
      const taskPayload = {
        EVAL_LANGUAGE_PLUGIN: { pluginText: evalText },
        EVAL_FETCH: { fetchText: evalText },
        EVAL_CODE: {
          code: evalText,
          language: state.languageDefinitions[evalType],
          chunkId
        }
      };
      await expectSaga(evaluateByType, evalType, evalText, chunkId)
        .withState(state)
        .call(triggerEvalFrameTask, evalTaskType, taskPayload[evalTaskType])
        .silentRun();
    });
  });
});

// ====================================

function mockChunk(type, text) {
  return { chunkType: type, chunkContent: text };
}

describe.skip("evaluateCurrentQueue test", () => {
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
