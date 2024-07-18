import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"
import { type IUser } from "../models/user.model"

interface AuthRequest extends Request {
  user?: IUser
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
    }
    req.user = { _id: decoded.userId } as IUser
    next()
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" })
  }
}
