import { envs } from '../configs/env.js'

// Middleware para manejo de erores
const errorHandler = (err, req, res, next) => {
  // Establece el código de estado y mensaje de error
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (envs.NODE_ENV === 'development') {
    console.error(err.stack) // Mostrar stack trace en la consola
    return res.status(statusCode).json({
      error: message,
      stack: err.stack // Incluir stack trace en la respuesta en desarrollo
    })
  }

  res.status(statusCode).json({
    error: message,
    stack: '' // No incluir stack trace en producción
  })
}

export default errorHandler
