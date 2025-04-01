import { PrismaClient } from "@prisma/client";
import { User } from '../types/modelsTypes'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const userLogin = async (email: string, password: string): Promise<string|null> => {
  try {
    const user = await prisma.user.findFirst({ where: { email: email } })
    if (!user) return null


    if (user.password === password) {
      const token = jwt.sign({ userId: user.id, userEmail: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
      return token
    }

    return null
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}
