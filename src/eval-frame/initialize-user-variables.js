import { updateUserVariables } from "./actions/actions";
import { sendActionToEditor } from "./actions/editor-message-senders";

export default () => {
  sendActionToEditor(updateUserVariables());
};
