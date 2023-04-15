interface Array<T> {
  group(
    callback: (element: T, index: number, array: Array<T>) => any,
    thisArg?: Object
  ): Object;
}
