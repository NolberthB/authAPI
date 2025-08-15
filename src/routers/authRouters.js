import { Router } from 'express'
import controllers from '../controller/index.js'
import { validateUser } from '../validations/validateUser.js'

import { authenticateUser } from '../middlewares/auth.middleware.js'
import { authorizeRoles } from '../middlewares/role.middleware.js'

const router = Router()

router.post('/login', controllers.login)
router.post('/register', validateUser, controllers.register)
router.get('/profile', authenticateUser, authorizeRoles('customer'), controllers.getProfile)

export default router
