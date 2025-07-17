import Errors from '../utils/errors.js'

export const authRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Verifica si el usuario tiene un rol
    if (!req.user || !req.user.role) {
      throw new Errors.ForbiddenError('Role not found')
    }

    // Validar si el rol del usuario está permitido
    if (!allowedRoles.includes(req.user.role)) {
      // Si no está permitido, se lanza un error
      throw new Errors.ForbiddenError('You do not have access')
    }

    // Si el rol esta permitido, dejamos continuar
    next()
  }
}
