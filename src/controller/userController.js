import { User } from '../models/postgres/userModel.js'

export const getAll = async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.send({ users })
  } catch (error) {
    console.log(error.message)
  }
}
