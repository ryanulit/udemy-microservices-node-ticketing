import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { validateRequest } from '../middlewares/validate-request'
import { User } from '../models/user'
import { RequestValidationError } from '../errors/request-validation-error'
import { BadRequestError } from '../errors/bad-request-error'

const router = express.Router()

const validator = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
]

router.post(
  '/api/users/signup', 
  validator, 
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      // console.log('email in use')
      // return res.status.send({})
      throw new BadRequestError('Email in use')
    }

    const user = User.build({ email, password })
    await user.save()

    // generate jwt
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      }, 
      process.env.JWT_KEY!
    )

    // store on session object
    req.session = {
      jwt: userJwt
    }

    res.status(201).send(user)
})

export { router as signupRouter }