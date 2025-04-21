import { Errors } from '../errors/index.js'

// Mapea los nombres de errores definidos en la fábrica
const knownErrorsNames = Object.keys(Errors)

export const logStartupError = (error, env) => {
  const isKnown = knownErrorsNames.includes(error.name)

  console.error(`🔥 Server startup error: ${isKnown ? error.message : 'Unexpected error, please try again later. ...'}`)

  if (env === 'development') {
    console.error(error.stack)
  }
}
