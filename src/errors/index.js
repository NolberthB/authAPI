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

export const Errors = {
  ValidationError: createErrorFactory('ValidationError', 400),
  InvalidCredentialsError: createErrorFactory('InvalidCredentialsError', 401),
  UserNotFoundError: createErrorFactory('UserNotFoundError', 404),
  BusinessError: createErrorFactory('BusinessError', 409),
  DatabaseError: createErrorFactory('DatabaseError', 500),
  TokenGenerationError: createErrorFactory('TokenGenerationError', 500),
  InternalServerError: createErrorFactory('InternalServerError', 500),
  ConnectionError: createErrorFactory('ConnectionError', 503)
}
