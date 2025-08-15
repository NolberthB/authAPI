import jwt from 'jsonwebtoken'
import { envs } from '../configs/env.js'
import { Errors } from '../errors/index.js'

// Middleware para verificar token JWT
export const authenticateUser = (req, res, next) => {
  const token = req.cookies.token // Se obtiene el token de la cookie

  // Valida si el token existe
  if (!token) {
    throw new Errors.UnauthorizedError('No token provided')
  }
  // Verifica si el token es válido
  try {
    const decoded = jwt.verify(token, envs.SECRET_JWT_KEY)
    req.user = decoded // Se guarda la info del token (id, role, etc.)
    next()
  } catch (error) {
    throw new Errors.UnauthorizedError('Invalid or Expire token')
  }
}
