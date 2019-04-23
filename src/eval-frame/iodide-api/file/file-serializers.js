import IodideAPIError from "./iodide-api-error";

function serializeToJSON(data) {
  try {
    return JSON.stringify(data);
  } catch (err) {
    throw new IodideAPIError(err.message);
  }
}

function serializeToString(data) {
  try {
    return data.toString();
  } catch (err) {
    throw new IodideAPIError(err.message);
  }
}

function isArrayBuffer(value) {
  // borrowed from https://stackoverflow.com/questions/21753581/check-for-an-instance-of-arraybufferview
  return (
    value &&
    value.buffer instanceof ArrayBuffer &&
    value.byteLength !== undefined
  );
}

function serializeToArrayBuffer(data) {
  if (!isArrayBuffer(data)) {
    throw new IodideAPIError(`data is not a valid ArrayBuffer`);
  }
  // array buffers serialize as-is. Pass through the data.
  return data;
}

function serializeToBlob(data) {
  try {
    return new Blob([data]);
  } catch (err) {
    throw new IodideAPIError(err.message);
  }
}

export default {
  text: serializeToString,
  json: serializeToJSON,
  arrayBuffer: serializeToArrayBuffer,
  blob: serializeToBlob
};
