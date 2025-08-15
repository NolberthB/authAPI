import { authService } from '../services/authServices.js'

export const getProfile = async (req, res, next) => {
  try {
    const username = req.user.username
    const profile = await authService.getProfile(username)

    if (!profile) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    return res.status(200).json({
      message: 'Perfil obtenido correctamente',
      profile
    })
  } catch (error) {
    next(error)
  }
}
