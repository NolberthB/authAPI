import mongoose from 'mongoose'
import { MONGO_URI } from './env.js'

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB ...')
  } catch (error) {
    console.log(error.message)
  }
}

export default connectDB
