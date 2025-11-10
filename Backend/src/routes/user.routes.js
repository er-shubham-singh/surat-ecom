import express from 'express'
import * as userController from '../controller/user.contoller.js'

const Router = express.Router()

Router.post("/register", userController.register)
Router.post("/login",userController.login)


export default Router