import Joi from 'joi'

// Define el schema para validar las variables de entorno
const envSchema = Joi.object({
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

// TODO: MANEJAR EL ERROR DE VALIDACION CON EL MIDDLEWARE DE ERROR
if (error) throw new Error(`Config validation error: ${error.message}`)

export const envs = {
  NODE_ENV: 'production',
  PORT: value.PORT,
  MONGO_URI: value.MONGO_URI,
  SALT_ROUNDS: value.SALT_ROUNDS,
  SECRET_JWT_KEY: value.SECRET_JWT_KEY,
  POSTGRES_URI: value.POSTGRES_URI
}
