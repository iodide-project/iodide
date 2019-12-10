import { languageDefinitions } from "./language-definitions";
import { historySchema } from "../console/history/state-schema";
import { consoleInputSchema } from "../console/input/state-schema";

// FIXME: break out enums to be in a separate file.
export const NONCODE_EVAL_TYPES = ["css", "md", "raw"];
export const RUNNABLE_CHUNK_TYPES = ["plugin", "fetch"];
export const FETCH_CHUNK_TYPES = [
  "css",
  "js",
  "text",
  "blob",
  "json",
  "arrayBuffer",
  "plugin"
];

export const IODIDE_API_LOAD_TYPES = ["text", "blob", "json", "arrayBuffer"];
export const FILE_SOURCE_INPUT_STATUS_TYPES = [
  "NONE",
  "LOADING",
  "SUCCESS",
  "ERROR"
];

export const FILE_SOURCE_UPDATE_INTERVAL_MAP = {
  "never updates": null,
  "updates daily": "1 day, 0:00:00",
  "updates weekly": "7 days, 0:00:00"
};

export const FILE_SOURCE_UPDATE_SELECTOR_OPTIONS = [
  { label: "never", key: "never updates" },
  { label: "daily", key: "updates daily" },
  { label: "weekly", key: "updates weekly" }
];

export const reverseFileSourceUpdateInterval = v => {
  if (v === null) return "never updates";
  if (v === "604800.0") return "updates weekly";
  return "updates daily";
};
export const FILE_SOURCE_UPDATE_INTERVALS = Object.keys(
  FILE_SOURCE_UPDATE_INTERVAL_MAP
);
export const FILE_UPDATE_OPERATION_STATUSES = [
  "pending",
  "running",
  "completed",
  "failed"
];

const appMessageSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    details: { type: "string" },
    when: { type: "string" },
    id: { type: "integer", minimum: 0 }
  },
  additionalProperties: false
};

export const languageSchema = {
  type: "object",
  properties: {
    pluginType: { type: "string", enum: ["language"] },
    languageId: { type: "string" },
    displayName: { type: "string" },
    module: { type: "string" },
    evaluator: { type: "string" },
    asyncEvaluator: { type: "string" },
    url: { type: "string" },
    autocomplete: { type: "string" }
  },
  additionalProperties: true
};

export const fileSchema = {
  type: "object",
  properties: {
    filename: { type: "string" },
    id: { type: "integer" },
    lastUpdated: { type: "string" }
  },
  additionalProperties: false
};

export const fileUpdateOperationSchema = {
  type: ["object", "null"],
  properties: {
    id: { type: "integer" },
    scheduled_at: { type: ["string", "null"] },
    started_at: { type: ["string", "null"] },
    ended_at: { type: ["string", "null"] },
    status: { type: ["string", "null"] },
    failure_reason: { type: ["string", "null"] }
  }
};

export const fileSourceSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    url: { type: ["string", "null"] },
    filename: { type: "string" },
    update_interval: { type: ["string", "null"] },
    latest_file_update_operation: fileUpdateOperationSchema
  }
};

const panePositionSchema = {
  type: "object",
  properties: {
    display: { type: "string", enum: ["none", "block"], default: "none" },
    top: { type: "number", default: 0 },
    left: { type: "number", default: 0 },
    width: { type: "number", default: 0 },
    height: { type: "number", default: 0 }
  },
  additionalProperties: false
};

const positionerDefaults = {
  display: "none",
  top: 0,
  left: 0,
  width: 0,
  height: 0
};

const cursorPositionSchema = {
  type: "object",
  properties: {
    line: { type: "number", default: 0 },
    col: { type: "number", default: 0 }
  },
  additionalProperties: false
};

export const stateProperties = {
  appMessages: {
    type: "array",
    items: appMessageSchema,
    default: []
  },
  consoleInput: consoleInputSchema,
  editorCursor: {
    type: "object",
    properties: {
      line: { type: "integer" },
      col: { type: "integer" }
    },
    additionalProperties: false,
    default: { line: 1, col: 1 }
  },
  editorSelections: {
    type: "array",
    items: {
      type: "object",
      properties: {
        start: cursorPositionSchema,
        end: cursorPositionSchema,
        selectedText: { type: "string" }
      },
      additionalProperties: false,
      default: {}
    },
    default: []
  },

  gettingRevisionList: {
    type: "boolean",
    default: false
  },
  hasPreviousAutosave: {
    type: "boolean",
    default: false
  },
  history: historySchema,
  iomd: {
    type: "string",
    default: ""
  },
  previouslySavedContent: {
    type: "object",
    default: { title: "", iomd: "" },
    properties: {
      title: { type: "string" },
      iomd: { type: "string" }
    }
  },
  iomdChunks: {
    type: "array",
    items: {
      type: "object",
      properties: {
        chunkContent: { type: "string" },
        chunkType: { type: "string" },
        chunkId: { type: "string" },
        evalFlags: {
          type: "array",
          items: { type: "string" }
        },
        startLine: { type: "integer" },
        endLine: { type: "integer" }
      },
      additionalProperties: false,
      default: {}
    },
    default: []
  },
  languageDefinitions: {
    type: "object",
    additionalProperties: languageSchema,
    default: languageDefinitions
  },
  languageLastUsed: {
    type: "string",
    default: "js"
  },
  lastExport: {
    type: "string",
    default: undefined
  },
  lastSaved: {
    type: "string",
    default: undefined
  },
  loadedLanguages: {
    type: "object",
    additionalProperties: languageSchema,
    default: { js: languageDefinitions.js }
  },
  modalState: {
    type: "string",
    enum: ["HELP_MODAL", "HISTORY_MODAL", "FILE_MODAL", "MODALS_CLOSED"],
    default: "MODALS_CLOSED"
  },
  kernelState: {
    type: "string",
    enum: [
      "KERNEL_LOADING",
      "KERNEL_LOAD_ERROR",
      "KERNEL_ERROR",
      "KERNEL_IDLE",
      "KERNEL_BUSY"
    ],
    default: "KERNEL_IDLE"
  },
  notebookHistory: {
    type: "object",
    properties: {
      hasLocalOnlyChanges: {
        type: "boolean",
        default: false
      },
      revisionContentFetchStatus: {
        type: "string",
        enum: ["FETCHING", "ERROR", "IDLE"],
        default: "IDLE"
      },
      revisionListFetchStatus: {
        type: "string",
        enum: ["FETCHING", "ERROR", "IDLE"],
        default: "IDLE"
      },
      revisionList: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            created: { type: "string" }
          }
        },
        default: []
      },
      selectedRevisionId: {
        type: "number"
      },
      revisionContent: {
        type: "object",
        additionalProperties: { type: "string" },
        default: {}
      }
    }
  },
  fileSources: {
    type: "object",
    properties: {
      sources: { type: "array", items: fileSourceSchema },
      statusMessage: { type: "string" },
      statusType: {
        type: "string",
        enum: FILE_SOURCE_INPUT_STATUS_TYPES
      },
      statusIsVisible: {
        type: "boolean"
      },
      url: { type: "string" },
      filename: { type: "string" },
      updateInterval: {
        type: "string",
        enum: FILE_SOURCE_UPDATE_SELECTOR_OPTIONS.map(f => f.key)
      },
      confirmDeleteID: { type: "number" },
      isDeletingAnimationID: { type: "number" }
    },
    default: {
      sources: [],
      statusMessage: "",
      statusType: "NONE",
      url: "",
      filename: "",
      updateInterval: FILE_SOURCE_UPDATE_SELECTOR_OPTIONS[0].key,
      confirmDeleteID: undefined,
      isDeletingAnimationID: undefined
    },
    additionalProperties: false
  },
  notebookInfo: {
    type: "object",
    properties: {
      files: { type: "array", items: fileSchema },
      user_can_save: { type: "boolean" },
      notebook_id: { type: "integer" },
      revision_id: { type: "integer" },
      revision_is_latest: { type: "boolean" },
      serverSaveStatus: {
        type: "string",
        enum: ["OK", "ERROR_UNAUTHORIZED", "ERROR_OUT_OF_DATE", "ERROR_GENERAL"]
      },
      connectionMode: {
        type: "string",
        enum: ["SERVER", "STANDALONE"]
      },
      tryItMode: { type: "boolean" }
    },
    default: {
      notebook_id: undefined,
      revision_id: undefined,
      revision_is_latest: true,
      user_can_save: false,
      connectionMode: "STANDALONE",
      serverSaveStatus: "OK",
      files: [],
      fileSources: []
    }
  },
  panePositions: {
    type: "object",
    additionalProperties: panePositionSchema,
    default: {
      EditorPositioner: Object.assign({}, positionerDefaults),
      ReportPositioner: Object.assign({}, positionerDefaults),
      ConsolePositioner: Object.assign({}, positionerDefaults),
      WorkspacePositioner: Object.assign({}, positionerDefaults)
    }
  },
  title: {
    type: "string",
    default: "untitled"
  },
  userData: {
    type: "object",
    properties: {
      name: { type: "string" },
      avatar: { type: "string" }
    },
    additionalProperties: false,
    default: {}
  },
  userDefinedVarNames: {
    type: "array",
    items: { type: "string" },
    default: []
  },
  viewMode: {
    type: "string",
    enum: ["EXPLORE_VIEW", "REPORT_VIEW"],
    default: "EXPLORE_VIEW"
  },
  wrapEditors: {
    type: "boolean",
    default: true
  }
};

export const stateSchema = {
  type: "object",
  properties: stateProperties,
  additionalProperties: false
};
