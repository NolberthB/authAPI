import 'dotenv/config'
import app from './app.js'
import { connectDB } from './configs/db/postgresDB.js'
import { logStartupError } from './utils/logStartupError.js'
import { envs } from './configs/env.js'

const startServer = async () => {
  try {
    // await connectDB() // <- connection mongo database
    await connectDB() // <- connection and sync postgreSQL database

    app.listen(envs.PORT, () => console.log(`✅ Server running on port: ${envs.PORT}`))
  } catch (error) {
    // Loguear el error y finalizar el proceso si el servidor no pudo iniciar
    logStartupError(error, envs.NODE_ENV)
    process.exit(1) // Termina el proceso con un error
  }
}

startServer()
