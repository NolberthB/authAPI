import { envs } from '../configs/env.js'
import { Errors } from '../errors/index.js'

// Middleware para manejo de erores
const errorHandler = (err, req, res, next) => {
  // Establece el código de estado y mensaje de error
  const isValidStatus = (code) => typeof code === 'number' && code >= 100 && code <= 599
  const statusCode = isValidStatus(err.statusCode) ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'

  if (envs.NODE_ENV === 'development') {
    console.error(err.stack) // Mostrar stack trace en la consola
    return res.status(statusCode).json({
      error: message,
      stack: err.stack // Incluir stack trace en la respuesta en desarrollo
    })
  }
  // En producción: mostrar mensaje genérico si el error no es conocido
  const knownErrorsNames = Object.keys(Errors)
  const isKnownError = knownErrorsNames.includes(err.name)

  res.status(statusCode).json({
    error: isKnownError ? err.message : 'Ocurrió un error inesperado. Inténtalo más tarde.',
    stack: '' // No incluir stack trace en producción
  })
}

export default errorHandler
