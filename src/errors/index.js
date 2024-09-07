const createErrorFactory = function (name, defaultStatusCode = 500) {
  return class BusinessError extends Error {
    constructor (message, statusCode = defaultStatusCode) {
      super(message)
      this.name = name
      this.statusCode = statusCode
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export const InternalServerError = createErrorFactory('InternalServerError', 500)
export const ConnectionError = createErrorFactory('ConnectionError', 503)
export const ValidationError = createErrorFactory('ValidationError', 400)
