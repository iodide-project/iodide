import { call, take } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";

import { evaluateByType } from "../eval-queue-saga";
import {
  triggerEvalFrameTask,
  sendTaskToEvalFrame
} from "../eval-frame-sender";
import {
  evaluateLanguagePlugin,
  loadKnownLanguage,
  loadLanguagePlugin
} from "../language-plugin-saga";
import {
  addLoadingLanguageMsgToHistory,
  addInputToConsole,
  addEvalTypeConsoleErrorToHistory
} from "../../../console/history/actions";

import { historyIdGen } from "../../../tools/id-generators";

// this string is the returnValue from a saga was still running when
// it was timed out by redux-test-plan
const RUNNING_AT_TIMEOUT = "@@redux-saga/TASK_CANCEL";

function purifiedMessage(messageAction) {
  // set up message action template and drop keys that are impure
  const action = Object.assign({}, messageAction);
  delete action.historyId;
  return { action };
}

// ========================================================

describe("triggerEvalFrameTask test", () => {
  const taskType = "A_TASK";
  const payload = "PAYLOAD";
  const taskId = "TASK_ID";
  const throwOnError = true;
  const payloadFromEvalFrame = "payloadFromEvalFrame";
  let taskResponse;

  beforeEach(() => {
    taskResponse = { status: "not_ERROR", payload: payloadFromEvalFrame };
  });

  it("always sends task to eval frame", async () => {
    await expectSaga(
      triggerEvalFrameTask,
      taskType,
      payload,
      throwOnError,
      taskId
    )
      .provide([
        [call(sendTaskToEvalFrame, taskType, payload), taskId],
        [take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`), taskResponse]
      ])
      .call(sendTaskToEvalFrame, taskType, payload, taskId)
      .run();
  });

  it("throws correctly if EVAL_FRAME_TASK_RESPONSE action is 'ERROR'", async () => {
    taskResponse = { status: "ERROR" };
    // need to suppress console.error b/c saga uses it internally somehow
    console.error = jest.fn();

    await expectSaga(
      triggerEvalFrameTask,
      taskType,
      payload,
      throwOnError,
      taskId
    )
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

  it("returns payload if EVAL_FRAME_TASK_RESPONSE action is not 'ERROR'", async () => {
    await expectSaga(
      triggerEvalFrameTask,
      taskType,
      payload,
      throwOnError,
      taskId
    )
      .provide([
        [call(sendTaskToEvalFrame, taskType, payload), taskId],
        [take(`EVAL_FRAME_TASK_RESPONSE-${taskId}`), taskResponse]
      ])
      .dispatch(`EVAL_FRAME_TASK_RESPONSE-${taskId}`)
      .returns(payloadFromEvalFrame)
      .run();
  });

  it("never finishes if no EVAL_FRAME_TASK_RESPONSE is dispatched", async () => {
    const expectSagaOutcome = await expectSaga(
      triggerEvalFrameTask,
      taskType,
      payload,
      throwOnError,
      taskId
    )
      .provide([[call(sendTaskToEvalFrame, taskType, payload), taskId]])
      .silentRun();
    expect(expectSagaOutcome.returnValue).toBe(RUNNING_AT_TIMEOUT);
  });
});

// ========================================================

describe("loadKnownLanguage test", () => {
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
      .put.like(purifiedMessage(addLoadingLanguageMsgToHistory(displayName)))
      .call(loadLanguagePlugin, languagePlugin)
      .silentRun();
  });
});

// ========================================================

describe("evaluateByType test", () => {
  const evalType = "some_language_id";
  const evalText = "some code to eval";
  const chunkId = "chunk-1";
  const startLine = 10;
  const endLine = 23;

  const evalId = "input-1-some_language_id";

  let chunk;
  let state;
  let evalTaskType;

  beforeEach(() => {
    chunk = {
      chunkType: evalType,
      chunkContent: evalText,
      chunkId,
      startLine,
      endLine
    };

    state = {
      languageDefinitions: {
        [evalType]: { displayName: "LANG_NAME", languageId: evalType }
      },
      loadedLanguages: { [evalType]: "DUMMY" }
    };

    historyIdGen.resetIdForTestingPurposesOnly();
  });

  it("puts message and throws if evalType is not defined'", async () => {
    chunk.chunkType = "invalidEvalType";
    // need to suppress console.error b/c saga uses it internally somehow
    console.error = jest.fn();

    await expectSaga(evaluateByType, chunk)
      .withState(state)
      .put.like(
        purifiedMessage(addEvalTypeConsoleErrorToHistory("invalidEvalType"))
      )
      .silentRun()
      .catch(e => expect(e.message).toBe("unknown evalType"));
  });

  it("call loadKnownLanguage if lang NOT loaded", async () => {
    // overwrite loaded status of evalType
    state.loadedLanguages = {};
    await expectSaga(evaluateByType, chunk)
      .withState(state)
      .call(loadKnownLanguage, state.languageDefinitions[chunk.chunkType])
      .silentRun();
  });

  it("if lang NOT loaded, but loads ok, add input to console", async () => {
    // overwrite loaded status of evalType
    state.loadedLanguages = {};
    await expectSaga(evaluateByType, chunk)
      .withState(state)
      .provide([
        [
          call(loadKnownLanguage, state.languageDefinitions[chunk.chunkType]),
          "load lang ok"
        ]
      ])
      // .call(loadKnownLanguage, "LANG_NAME", evalType)
      .put.like(
        purifiedMessage(
          addInputToConsole(
            evalText,
            evalType,
            evalId,
            startLine,
            endLine,
            chunkId
          )
        )
      )
      .silentRun();
  });

  it("if lang pre-loaded don't call loadKnownLanguage", async () => {
    await expectSaga(evaluateByType, chunk)
      .withState(state)
      .not.call(loadKnownLanguage)
      .silentRun();
  });

  it("if lang pre-loaded, add input to console", async () => {
    // FIXME this is horribly brittle
    await expectSaga(evaluateByType, chunk)
      .withState(state)
      .put.like(
        purifiedMessage(
          addInputToConsole(
            evalText,
            evalType,
            evalId,
            startLine,
            endLine,
            chunkId
          )
        )
      )
      .silentRun();
  });

  it(`if evalType ok, trigger correct eval frame action for "plugin"`, async () => {
    chunk.chunkType = "plugin";
    chunk.chunkContent = "{}";
    await expectSaga(evaluateByType, chunk)
      .withState(state)
      .call(evaluateLanguagePlugin, chunk.chunkContent)
      .silentRun();
  });

  [[evalType, "EVAL_CODE"]].forEach(evalTypeCase => {
    it(`if evalType ok, trigger correct eval frame action for "${evalTypeCase[0]}"`, async () => {
      const [evalTypeForCase, evalTaskTypeForCase] = evalTypeCase;
      const taskPayload = {
        EVAL_LANGUAGE_PLUGIN: { pluginText: evalText },
        EVAL_CODE: {
          code: evalText,
          language: state.languageDefinitions[evalTypeForCase],
          chunkId
        }
      };
      const throwOnError = false;

      await expectSaga(evaluateByType, chunk)
        .withState(state)
        .call(
          triggerEvalFrameTask,
          evalTaskTypeForCase,
          taskPayload[evalTaskTypeForCase],
          throwOnError,
          evalId
        )
        .silentRun();
    });
  });
});
