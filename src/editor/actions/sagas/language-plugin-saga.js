import { call, put } from "redux-saga/effects";

import {
  addLoadingLanguageMsgToHistory,
  addPluginParseErrorToHistory
} from "../../console/history/actions";
import { triggerEvalFrameTask } from "./eval-frame-sender";

export const languageReady = (state, lang) =>
  Object.keys(state.loadedLanguages).includes(lang);

export const languageKnown = (state, lang) =>
  Object.keys(state.languageDefinitions).includes(lang);

export const languageNeedsLoading = (state, lang) =>
  languageKnown(state, lang) && !languageReady(state, lang);

export function* loadLanguagePlugin(pluginData) {
  yield call(triggerEvalFrameTask, "EVAL_LANGUAGE_PLUGIN", {
    pluginData
  });
  yield put({
    type: "ADD_LANGUAGE_TO_EDITOR",
    languageDefinition: pluginData
  });
}

export function* loadKnownLanguage(pluginData) {
  yield put(addLoadingLanguageMsgToHistory(pluginData.displayName));
  yield call(loadLanguagePlugin, pluginData);
}

export function* evaluateLanguagePlugin(pluginText) {
  let pluginData;
  try {
    pluginData = JSON.parse(pluginText);
  } catch (error) {
    yield put(addPluginParseErrorToHistory(error.message));
    throw error;
  }

  yield call(loadLanguagePlugin, pluginData);
}
