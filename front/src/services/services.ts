import axios from "axios";
import { Booking, Availability } from "../types/userTypes";

const api = axios.create({
  baseURL: "http://localhost:3000/api/"
})

export const filterAvailabilitiesHours = async (allTimes:Availability[], dateSelected: string) => {
  const date = allTimes.filter((e) => e.date === dateSelected)
  return date[0]?.times
}

interface availabilitiesResponse {
  availabilities: Availability[]
}
export const getAvailabilities = async (): Promise<Availability[]> => {
  const res = await api.get<Partial<availabilitiesResponse>>('/getAvailabilities');
  const list = res.data.availabilities || []
  return list
  
}
