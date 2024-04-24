import axios from "axios";
import "dotenv/config";



export const client = axios.create({
  baseURL: "https://api.rawg.io/api/games",
  params: {
    key: process.env.RAWG_API_KEY,
  },
});
