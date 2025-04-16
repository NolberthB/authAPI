import 'dotenv/config'

import express from 'express'
import cookieParser from 'cookie-parser'

import errorHandler from './middlewares/errorHandler.js'
import { envs } from './configs/env.js'
// import connectDB from './db/mongoDB.js'
import { connectDB, syncTables } from './db/postgresDB.js'
import authRouters from './routers/authRouters.js'

const app = express()

const startServer = async () => {
  try {
    // await connectDB() // <- connection mongo database

    await connectDB() // <- connection postgreSQL database
    await syncTables() // <- sync las tablas de la db

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

    app.listen(envs.PORT, () => console.log(`Server running on port: ${envs.PORT}`))
    //
  } catch (error) {
    // Loguear el error y finalizar el proceso si el servidor no pudo iniciar
    console.error('Error starting server:', error.message)
    process.exit(1) // Termina el proceso con un error
  }
}

startServer()
