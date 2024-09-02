import express from 'express'
import { PORT } from './configs/env.js'

const app = express()

app.get('/', (req, res) => {
  res.send({
    message: 'Hello API Auth Service'
  })
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
