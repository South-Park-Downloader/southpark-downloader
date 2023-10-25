type DeepObject = {
  foo: {
    bar: {
      baz: string;
    };
  };
  x: {
    y: number;
  };
};

type GetNestedKeys<T, K extends string> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? [Key, ...GetNestedKeys<T[Key], Rest>]
    : never
  : K extends keyof T
  ? [K]
  : never;

type dots = DotNotations<DeepObject>;

function getNestedKeys<T, K extends string>(
  obj: T,
  key: K
): GetNestedKeys<T, K> {
  return key.split('.').reduce((keys, nestedKey) => {
    if (nestedKey in keys) {
      return keys[nestedKey];
    } else {
      throw new Error(`Key not found: ${nestedKey}`);
    }
  }, obj) as GetNestedKeys<T, K>;
}

const myObject: DeepObject = {
  foo: {
    bar: {
      baz: 'Hello, world!',
    },
  },
  x: {
    y: 42,
  },
};

const result = getNestedKeys(myObject, 'foo.bar.baz'); // result: ["foo", "bar", "baz"]
