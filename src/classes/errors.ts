class MusixmatchTypeError extends TypeError {
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
class MusixmatchSyntaxError extends SyntaxError {
  constructor(...message: string[]) {
    super(message.join(" "));
    this.name = "MusixmatchSyntaxError";
  }
}
class MusixmatchReferenceError extends ReferenceError {
  constructor(...message: string[]) {
    super(message.join(" "));
    this.name = "MusixmatchReferenceError";
  }
}

class MusixmatchAPIError extends Error {
  constructor(...message: string[]) {
    super(message.join(" "));
    this.name = "MusixmatchAPIError";
  }
}

class MusixmatchRangeError extends RangeError {
  constructor(...message: string[]) {
    super(message.join(" "));
    this.name = "MusixmatchRangeError";
  }
}

export {
  MusixmatchError,
  MusixmatchTypeError,
  MusixmatchReferenceError,
  MusixmatchSyntaxError,
  MusixmatchAPIError,
  MusixmatchRangeError,
};
