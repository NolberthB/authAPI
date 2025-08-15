import { Errors } from '../errors/index.js'

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { user } = req

    if (!user || !allowedRoles.includes(user.role)) {
      throw new Errors.ForbiddenError('No tienes permiso para acceder a esta ruta')
    }

    next()
  }
}
