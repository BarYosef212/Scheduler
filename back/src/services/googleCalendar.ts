import { google } from 'googleapis';
import dotenv from 'dotenv';
import { Booking, User } from '../types/modelsTypes';
import { updateUser } from './userServices';
import { getUser } from './userServices';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const redirectToGoogleAuth = (req: any, res: any) => {
  try {
    const { userId } = req.query;
    const state = JSON.stringify({ userId });
    const url = getAuthUrl(state);
    res.redirect(url);
  } catch (error) {
    console.error('Error in redirectToGoogleAuth:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const handleGoogleAuthCallback = async (req: any, res: any) => {
  try {
    const { code, state } = req.query;
    const { tokens } = await oauth2Client.getToken(code as string);
    setCredentials(tokens);
    const { userId } = JSON.parse(decodeURIComponent(state as string));
    await updateUser(userId, { googleTokens: tokens });
    const redirectUrl = process.env.PRODUCTION === 'true'
      ? `${process.env.FRONT_URL}/admin/${userId}`
      : `http://localhost:5173/admin/${userId}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in handleGoogleAuthCallback:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getAuthUrl = (state: string) => {
  try {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: encodeURIComponent(state),
    });
  } catch (error) {
    console.error('Error in getAuthUrl:', error);
    throw error;
  }
};

export const refreshAccessToken = async (user: User) => {
  try {
    const { googleTokens } = user;
    oauth2Client.setCredentials({ refresh_token: googleTokens.refresh_token });
    const response = await oauth2Client.refreshAccessToken();
    const tokens = response.credentials;
    setCredentials(tokens);
    await updateUser(user.id, { googleTokens: tokens });
    return tokens;
  } catch (error) {
    console.error('Error in refreshAccessToken:', error);
    throw error;
  }
};

export const setCredentials = (tokens: any) => {
  try {
    oauth2Client.setCredentials(tokens);
  } catch (error) {
    console.error('Error in setCredentials:', error);
    throw error;
  }
};

export const createEvent = async (userId: string, calendarId: string, data: Booking) => {
  try {
    let user = await getUser(userId);
    let { googleTokens } = user;

    const expiryDate = googleTokens.expiry_date;
    if (expiryDate && expiryDate <= Date.now()) {
      googleTokens = await refreshAccessToken(user);
      user = { ...user, googleTokens };
    }
    setCredentials({ access_token: googleTokens.access_token });

    const { date, hour, clientName, clientEmail, clientPhone } = data;
    const [startHour, startMinute] = hour.split("-")[0].trim().split(':').map(Number);
    const [endHour, endMinute] = hour.split("-")[1].trim().split(':').map(Number);

    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0, 0);

    const event = {
      summary: 'פגישה במערכת תורים',
      description: `תור עבור ${clientName}`,
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: endDate.toISOString() },
      visibility: 'private',
      attendees: [
        {
          email: clientEmail,
          comment: `Phone: ${clientPhone}`,
        },
      ],
    };

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });
    return response.data;
  } catch (error) {
    console.error('Error in createEvent:', error);
    throw error;
  }
};



export const deleteEvent = async (userId: string, calendarId: string, eventId: string) => {
  try {
   
    let user = await getUser(userId);
    let { googleTokens } = user;

    const expiryDate = googleTokens.expiry_date;
    if (expiryDate && expiryDate <= Date.now()) {
      googleTokens = await refreshAccessToken(user);
      user = { ...user, googleTokens };
    }

    setCredentials({ access_token: googleTokens.access_token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    await calendar.events.delete({
      calendarId,
      eventId,
    });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    throw error;
  }
};
