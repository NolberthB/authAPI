import express from 'express'
import cookieParser from 'cookie-parser'

import authRouters from './routers/authRouters.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

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

export default app
