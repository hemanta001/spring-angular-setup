export {ResponseModel};

class ResponseModel<T> {
  constructor(public data: T, public meta?: object) {
  }
}
