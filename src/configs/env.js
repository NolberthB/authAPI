import Joi from 'joi'
import { Errors } from '../errors/index.js'
import { logStartupError } from '../utils/logStartupError.js'

// Define el schema para validar las variables de entorno
const envSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().required().port().default(3000),
  MONGO_URI: Joi.string().required(),
  POSTGRES_URI: Joi.string().required(),
  SALT_ROUNDS: Joi.number().default(10).required(),
  SECRET_JWT_KEY: Joi.string().required()
}).unknown(true) // <- Permite usar propiedades adicionales no definidas en el schema

// Destructuracion del valor y el error para validar el esquema con el .env
const { value, error } = envSchema.validate(process.env, {
  abortEarly: false, // <- Evalua todo el objeto y devuelve una lista completa de errores
  allowUnknown: true // <- Acepta propiedades que no estén definidas en el esquema
  // Es igual que usar unknown directamente en el esquema, pero se pasa como una
  // opcion global
})

// Manejo de errores de validación
if (error) {
  // Crear el error personalizado y pasarle el mensaje original de Joi
  const validationError = new Errors.ValidationError(
    `Error al cargar las variables de entorno:\n ${error.details.map(e => `- ${e.message}`).join('\n')}`
  )
  logStartupError(validationError, value.NODE_ENV)
  process.exit(1) // Termina el proceso si no se puede validar el .env
}

export const envs = {
  NODE_ENV: value.NODE_ENV,
  PORT: value.PORT,
  MONGO_URI: value.MONGO_URI,
  SALT_ROUNDS: value.SALT_ROUNDS,
  SECRET_JWT_KEY: value.SECRET_JWT_KEY,
  POSTGRES_URI: value.POSTGRES_URI
}
