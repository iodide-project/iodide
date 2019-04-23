export default class IodideAPIError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IodideAPIError);
    }

    this.name = "IodideAPIError";
  }
}
