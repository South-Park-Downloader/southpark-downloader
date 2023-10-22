/**
 * Utility to emulate Record<> while keeping optional properties optional.
 */
type SafeRecord<O, T> = {
  [K in keyof O]: T;
};
