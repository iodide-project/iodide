import generateRandomId from "./generate-random-id";
import { historySchema } from "../state-schemas/state-schema";

const properties = new Set(Object.keys(historySchema.properties));
const historyTypes = new Set(historySchema.properties.historyType.enum);

export default function createHistoryItem(args) {
  Object.keys(args).forEach(k => {
    if (!properties.has(k))
      throw Error(`history property ${k} not in history Schema`);
  });
  if (!args.historyType)
    throw new Error("no historyType provided for history item");
  if (!historyTypes.has(args.historyType))
    throw new Error(`history type ${args.historyType} not in schema`);
  const newArgs = Object.assign({}, args);
  newArgs.historyId = newArgs.historyId || generateRandomId();
  newArgs.lastRan = newArgs.lastRan || +new Date();
  return newArgs;
}
