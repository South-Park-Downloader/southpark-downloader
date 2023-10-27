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

type NotEmpty<T extends Array<any>, True = T, False = never> = T extends never[]
  ? False
  : True;

/**
 * Utility type similar to Record except that it does provide generic string keys.
 */
type GenericRecord<T = any> = {
  [key: string]: T;
};

/**
 * Utility type to decide if T is an GenericRecord and provide a type for each case.
 */
type IsGenericRecord<T, True = T, False = never> = T extends GenericRecord
  ? True
  : False;

/**
 * Utility type to transform the type of ALL properties of a nested object
 * while respecting optional properties (? over undefined).
 */
type NestedTransform<O extends GenericRecord, T extends string = string> = {
  [K in keyof O]: IsGenericRecord<O[K], NestedTransform<O[K], T>, T>;
};

/**
 * Utility type to represent a DotNotation for readablity.
 */
type DotNotation<T extends string = string> = T;

/**
 * Utility type to get all possible "dot.notations" of a given type.
 */
type DotNotations<O extends GenericRecord> = {
  [K in keyof O]: K extends string
    ?
        | DotNotation<`${K}`>
        | IsGenericRecord<O[K], DotNotation<`${K}.${DotNotations<O[K]>}`>>
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
 * Utility type to represent a key array for readablity.
 */
type KeyNotation<T extends string[] = string[]> = T;

/**
 * Utility type to determine if T is a KeyNotation.
 */
type IsKeyNotation<T, True = T, False = never> = T extends string[]
  ? True
  : False;

/**
 * Utility type to retrieve all key notations of the provided object.
 */
type KeyNotations<O extends GenericRecord> = {
  [K in keyof O]: K extends string
    ?
        | KeyNotation<[`${K}`]>
        | IsGenericRecord<O[K], KeyNotation<[`${K}`, ...KeyNotations<O[K]>]>>
    : never;
}[keyof O];

const obj = {
  foo: {
    bar: {
      baz: 'test',
    },
  },
  bal: 123,
};

type abc = KeyNotations<typeof obj>;

/**
 * Utility type to retrieve the value type of a nested object property via key notation.
 */
type KeyValue<O, K extends KeyNotation> = NotEmpty<
  K,
  K extends [infer First, ...infer Rest]
    ? First extends keyof O
      ? NotEmpty<
          Rest,
          Rest extends string[] ? KeyValue<O[First], Rest> : never,
          O[First]
        >
      : never
    : never
>;

/**
 * Utility type to retrieve the key array of the povided "dot.notation" path in the provided object.
 */
type DotToKeyNotation<
  O extends GenericRecord,
  K extends string
> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof O
    ? [Key, ...DotToKeyNotation<O[Key], Rest>]
    : never
  : K extends keyof O
  ? [K]
  : never;
