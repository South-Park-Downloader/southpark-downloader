export default class InvalidFilterStopError extends Error {
  public readonly input: string;

  constructor(input: string) {
    super(
      `The input '${input}' is not a valid filter stop. Please refer to the documentation at TODO.`
    );

    this.input = input;
  }
}
