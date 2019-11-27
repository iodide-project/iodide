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
  const payloadFromEvalFrame = "payloadFromEvalFrame";
  let taskResponse;

  beforeEach(() => {
    taskResponse = { status: "not_ERROR", payload: payloadFromEvalFrame };
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

  it("returns payload if EVAL_FRAME_TASK_RESPONSE action is not 'ERROR'", async () => {
    await expectSaga(triggerEvalFrameTask, taskType, payload)
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
      payload
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
      .put.like(purifiedMessage(addEvalTypeConsoleErrorToHistory(evalType)))
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

  [[evalType, "EVAL_CODE"]].forEach(evalTypeCase => {
    it(`if evalType ok, trigger correct eval frame action for "${evalTypeCase[0]}"`, async () => {
      [evalType, evalTaskType] = evalTypeCase;
      const taskPayload = {
        EVAL_LANGUAGE_PLUGIN: { pluginText: evalText },
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
