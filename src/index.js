import 'dotenv/config'
import { envs } from './configs/env.js'

import express from 'express'
import cookieParser from 'cookie-parser'

import { connectDB } from './configs/db/postgresDB.js'

import errorHandler from './middlewares/errorHandler.js'
import { logStartupError } from './utils/logStartupError.js'

import authRouters from './routers/authRouters.js'

const app = express()

const startServer = async () => {
  try {
    // await connectDB() // <- connection mongo database

    await connectDB() // <- connection and sync postgreSQL database

    // middlewares
    app.use(express.json())
    app.use(cookieParser())

    // routers
    app.use('/auth', authRouters)

    app.get('/', (req, res) => {
      res.send({
        message: 'Hello API Auth Service'
      })
    })

    // middleware catcher errors
    app.use(errorHandler)

    app.listen(envs.PORT, () => console.log(`✅ Server running on port: ${envs.PORT}`))
  } catch (error) {
    // Loguear el error y finalizar el proceso si el servidor no pudo iniciar
    logStartupError(error, envs.NODE_ENV)
    process.exit(1) // Termina el proceso con un error
  }
}

startServer()
