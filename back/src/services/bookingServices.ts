import { PrismaClient } from "@prisma/client";
import { Booking } from '../types/modelsTypes'
import { addTimeToAvailability, deleteTimeFromAvailability, getAvailabilityByDate } from "./availabilitiesServices";
import { BookingStatus } from "@prisma/client";
import dayjs from "dayjs";
import { getUser } from "./userServices";
import nodemailer from "nodemailer";
import sgMail from '@sendgrid/mail'

const prisma = new PrismaClient()


export const scheduleBooking = async (data: Booking): Promise<Booking | null> => {
  try {
    const { date, hour, userId, clientPhone } = data

    const existOnSameDay = await prisma.booking.findFirst({
      where: { userId, clientPhone: clientPhone, date: date, status: BookingStatus.CONFIRMED }
    })
    if (existOnSameDay) {
      return null
    }

    const availability = await getAvailabilityByDate(date, userId)
    if (!availability || !availability.times.includes(hour)) return null


    const booking = await prisma.booking.create({
      data
    })

    if (!booking) return null
    const deleted = await deleteTimeFromAvailability(date, hour, userId)
    if (!deleted) {
      await prisma.booking.delete({ where: { id: booking.id } });
      return null;
    }

    return booking

  } catch (error) {
    console.error("error in scheduleBooking service")
    throw error
  }
}

export const cancelBooking = async (booking: Booking): Promise<boolean> => {
  try {
    const { id, date, hour, userId } = booking
    const newDate = new Date(date)
    const added = await addTimeToAvailability(newDate, hour, userId)
    if (!added) return false


    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: {
        status: BookingStatus.CANCELLED
      }
    })

    if (!updatedBooking) {
      await deleteTimeFromAvailability(date, hour, userId);
      return false;
    }
    return true

  } catch (error) {
    console.error("error in cancelBooking")
    throw error
  }
}


export const getAllBookingsById = async (id: string): Promise<Booking[] | null> => {
  try {
    const bookings = await prisma.booking.findMany({ where: { userId: id } })
    if (!bookings) {
      return null
    }
    return bookings
  } catch (error) {
    console.error("error with getBookings controller")
    throw error
  }
}

export const updateBooking = async (newBooking: Booking, oldBooking: Booking): Promise<boolean> => {
  try {

    newBooking.date = new Date(newBooking.date)
    oldBooking.date = new Date(oldBooking.date)
    if (!(dayjs(newBooking.date).isSame(oldBooking.date)) || newBooking.hour != oldBooking.hour) {
      newBooking.updatedFromId = oldBooking.id

      const updatedOldBooking = await prisma.booking.update({
        where: { id: oldBooking.id },
        data: {
          status: BookingStatus.UPDATED,
        }
      })
      if (!updatedOldBooking) {
        return false
      }



      newBooking.createdAt = undefined
      const booked = await scheduleBooking(newBooking)
      if (!booked) {
        await prisma.booking.update({
          where: { id: oldBooking.id },
          data: {
            status: BookingStatus.CONFIRMED,
          }
        })
        return false
      }


      const canceled = await cancelBooking(oldBooking)
      if (!canceled) {
        await prisma.booking.update({
          where: { id: oldBooking.id },
          data: {
            status: BookingStatus.CONFIRMED,
          }
        })
        await prisma.booking.delete({ where: { id: booked.id } })
        return false
      }
    }
    else {
      await prisma.booking.update({ where: { id: oldBooking.id }, data: { ...newBooking } })
    }

    return true
  } catch (error) {
    console.error("error with updateBooking controller")
    throw error
  }
}


const getTransporter = (email: string, password: string) => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });
};
sgMail.setApiKey(process.env.NODEMAILER_API_KEY || "");

export const sendAppointmentUpdate = async (id: string, to: string, subject: string, text: string, logo?: string) => {
  try {
    const user = await getUser(id)
    if (!user.emailMessagePassword) return
    const { email, emailMessagePassword } = user
    const htmlContent = logo
      ? `<div style="direction: rtl; text-align: right;">
         <p>${text}</p>
         <img src="${logo}" alt="Logo" style="max-width: 200px; height: auto;" />
       </div>`
      : `<div style="direction: rtl; text-align: right;">
         <p>${text}</p>
       </div>`;

    const transporter = getTransporter(email, emailMessagePassword);
    const sendMailPromise = transporter.sendMail({
      from: `"מערכת ניהול תורים" <${email}>`,
      to,
      subject,
      html: htmlContent,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timed out after 10 seconds")), 10000)
    );

    try {
      await Promise.race([sendMailPromise, timeoutPromise]);
    } catch (error) {
      console.error("Error while sending email:", error);
      throw new Error("Failed to send email. Please check the email configuration or network connectivity.");
    }

    await Promise.race([sendMailPromise, timeoutPromise]);
  } catch (error) {
    console.error("שגיאה בשליחת המייל:", error);
  }
};
