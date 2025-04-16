import { check, validationResult } from 'express-validator'
// import { ValidationError } from '../errors'

export const validateUser = [
  // validaciones del username
  check('username')
    .exists()
    .not()
    .isEmpty(),

  check('password')
    .exists()
    .not()
    .isEmpty()
    .isString(),

  (req, res, next) => {
    validateResult(req, res, next)
  }
]

const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw()
    return next()
  } catch (error) {
    res.status(403)
    res.send({ errors: error.array() })
  }
}
