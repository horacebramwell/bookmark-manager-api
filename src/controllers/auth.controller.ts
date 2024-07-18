import { type Request, type Response } from "express"
import * as authService from "../services/auth.service"
import logger from "../utils/logger"

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body)
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id })
  } catch (error) {
    logger.error("Error registering user", error)
    res.status(500).json({ error: "Error registering user" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const token = await authService.loginUser(email, password)
    if (token) {
      res.json({ token })
    } else {
      res.status(401).json({ error: "Invalid credentials" })
    }
  } catch (error) {
    logger.error("Error logging in", error)
    res.status(500).json({ error: "Error logging in" })
  }
}
