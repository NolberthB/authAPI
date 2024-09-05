import 'dotenv/config'

import express from 'express'
import cookieParser from 'cookie-parser'

import { PORT } from './configs/env.js'
import connectDB from './configs/mongoDB.js'
import authRouters from './routers/authRouters.js'

const app = express()

connectDB() // <- Mongo connection

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

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
