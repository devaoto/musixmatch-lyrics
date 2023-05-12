class MusixmatchTypeError extends Error {
  constructor(...message: string[]) {
    super(message.join(" "));
    this.name = "MusixmatchTypeError";
  }
}

class MusixmatchError extends Error {
  constructor(...message: string[]) {
    super(message.join(" "));
    this.name = "MusixmatchError";
  }
}

export { MusixmatchError, MusixmatchTypeError };
