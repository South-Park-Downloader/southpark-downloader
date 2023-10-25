/**
 * Utility type similar to Record except that it does provide generic string keys.
 */
type GenericRecord<T = any> = {
  [key: string]: T;
};

/**
 * Utility type to decide if T is an GenericRecord and provide a type for each case.
 */
type IsGenericRecord<T, True, False> = T extends GenericRecord ? True : False;

/**
 * Utility type to convert a string type to CONSTANT_CASE.
 * It does support:
 * - camelCase
 * - CONST_CASE
 * - PascalCase
 * - snake_case
 */
type ConstantCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${ConstantCase<Rest>}`
  : S;

type test = ConstantCase<'testCase'>;
type a = test;

/**
 * Utility type to represent a DotNotation for readablity.
 */
type DotNotation<T extends string> = T;
/**
 * Utility type to get all possible "dot.notations" of a given type.
 */
type DotNotations<O extends GenericRecord> = {
  [K in keyof O]: K extends string
    ?
        | DotNotation<`${K}`>
        | IsGenericRecord<
            O[K],
            DotNotation<`${K}.${DotNotations<O[K]>}`>,
            never
          >
    : never;
}[keyof O];

/**
 * Utility type to retrieve the value type of a nested object property via "dot.notation".
 */
type DotValue<O extends GenericRecord, K extends string> = K extends keyof O
  ? O[K]
  : K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof O
    ? DotValue<O[Key], Rest>
    : never
  : never;

/**
 * Utility type to retrieve the key array of the povided "dot.notation" path in the provided object.
 */
type DotToKey<
  O extends GenericRecord,
  K extends string
> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof O
    ? [Key, ...DotToKey<O[Key], Rest>]
    : never
  : K extends keyof O
  ? [K]
  : never;

/**
 * Utility type to retrieve all keys arrays of the provided object.
 */
type Keys<O extends GenericRecord> = DotToKey<O, DotNotations<O>>;

/**
 * Utility type to transform the type of ALL properties of a nested object
 * while respecting optional properties (? over undefined).
 */
type NestedTransform<O extends GenericRecord, T extends string = string> = {
  [K in keyof O]: IsGenericRecord<O[K], NestedTransform<O[K], T>, T>;
};
