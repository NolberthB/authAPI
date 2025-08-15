import { User } from '../models/postgres/userModel.js'

export async function findUserByUsername (username) {
  return User.findOne({ where: { username } }) // <- Enstancia del modelo de Sequelize
}
