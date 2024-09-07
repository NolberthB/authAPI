import 'dotenv/config'

import express from 'express'
import cookieParser from 'cookie-parser'

import errorHandler from './middlewares/errorHandler.js'
import { PORT } from './configs/env.js'
import connectDB from './db/mongoDB.js'
import authRouters from './routers/authRouters.js'

const app = express()

const startServer = async () => {
  try {
    await connectDB() // <- connection database

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

    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    //
  } catch (error) {
    // Loguear el error y finalizar el proceso si el servidor no pudo iniciar
    console.error('Error starting server:', error.message)
    process.exit(1) // Termina el proceso con un error
  }
}

startServer()
