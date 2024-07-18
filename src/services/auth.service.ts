import jwt from "jsonwebtoken"
import User, { type IUser } from "../models/user.model"

export const registerUser = async (
  userData: Partial<IUser>,
): Promise<IUser> => {
  const user = new User(userData)
  return await user.save()
}

export const loginUser = async (
  email: string,
  password: string,
): Promise<string | null> => {
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    return null
  }

  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  })
}
