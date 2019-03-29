import {
  EditorPositioner,
  ConsolePositioner,
  ReportPositioner,
  WorkspacePositioner
} from "./layout-config-content-items";

export default {
  settings: {
    showPopoutIcon: false,
    showCloseIcon: false,
    showMaximiseIcon: false
  },
  dimensions: {
    dragProxyWidth: 300,
    dragProxyHeight: 0
  },
  content: [
    {
      type: "row",
      content: [
        {
          type: "column",
          content: [EditorPositioner]
        },
        {
          type: "stack",
          content: [ConsolePositioner, ReportPositioner, WorkspacePositioner]
        }
      ]
    }
  ]
};
