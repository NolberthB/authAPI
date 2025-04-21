import { Sequelize } from 'sequelize'
import { envs } from '../env.js'
import { logStartupError } from '../../utils/logStartupError.js'
import { Errors } from '../../errors/index.js'

// Connection PostgreSQL database
export const sequelize = new Sequelize(envs.POSTGRES_URI, { // <- Enstancia global
  dialect: 'postgres' // <- Especifica el tipo de db con la que se está trabajando
})

export const connectDB = async () => {
  try {
    await sequelize.authenticate() // <- Testing the connection
    console.log('✅ Connection to PostgreSQL has been established successfully.')

    // Sincronizar las tablas de la base de datos antes de hacer consultas.
    await sequelize.sync({ force: false }) // <- Crea las tablas si no existen
    console.log('✅ All models were synchronized successfully.')
  } catch (error) {
    // Lanza un error personalizado para que pueda ser manejado por el middleware
    const connectionError = new Errors.DatabaseError('Unable to connect to PostgreSQL')
    logStartupError(connectionError, envs.NODE_ENV)
    process.exit(1) // Termina el proceso si no se puede conectar a la DB
  }
}
