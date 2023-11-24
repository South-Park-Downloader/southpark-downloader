/**
 * Error hat represents error in the program logic. This kind
 * of error should lead directly to a fix in your code.
 */
export default class LogicError extends Error {
  constructor(message: string) {
    /* Provide the message to the base Error */
    super(message);
  }
}
