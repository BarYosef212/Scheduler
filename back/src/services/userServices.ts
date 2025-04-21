import { PrismaClient } from "@prisma/client";
import { User } from '../types/modelsTypes'
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import logger from "../config/logger";

const prisma = new PrismaClient()


export const userLogin = async (email: string, password: string): Promise<string|null> => {
  try {
    const user = await prisma.user.findFirst({
      where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
      },
    });

    if (!user) return null


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ userId: user.id, userEmail: user.email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      return token;
    }

    return null
  } catch (error:any) {
    logger.log(error)
    throw error
  }
}

export const getUser = async (userId: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user as User;
  } catch (error:any) {
    logger.log(error);
    throw error;
  }
};

export const updateUser = async(userId:string,data:Partial<User>):Promise<boolean>=>{
  try {
    const updated = await prisma.user.update({where:{id:userId},data})
    if (updated) return true
    return false
  } catch (error:any) {
    logger.log(error)
    throw error
  }
}

export const register = async(userName:string,email:string,password:string):Promise<boolean>=>{
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
      userName,
      email,
      password: hashedPassword,
      },
    });
    return true
  } catch (error:any) {
    logger.log(error)
    throw error
  }
}
