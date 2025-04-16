import { Sequelize } from 'sequelize'
import { envs } from '../configs/env.js'

// Connection PostgreSQL database
export const sequelize = new Sequelize(envs.POSTGRES_URI, { // <- Enstancia global
  dialect: 'postgres' // <- Especifica el tipo de db con la que se está trabajando
})

export const connectDB = async () => {
  try {
    await sequelize.authenticate() // <- Testing the connection
    console.log('Connection to PostgreSQL has been established successfully.')
  } catch (error) {
    // TODO: Manejar el error con el middleware de error
    console.error('Unable to connect to the database:', error)
    process.abort(1) // Termina el proceso con un error
  }
}

export const syncTables = async () => {
  try {
    await sequelize.sync({ force: false }) // <- Crea las tablas si no existen
    console.log('All models were synchronized successfully.')
  } catch (error) {
    console.error(error.message)
  }
}
