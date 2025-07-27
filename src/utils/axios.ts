import axios from "axios";

/**
 * @description   - Creates an axios instance with the base url of the api
 * @development   - http://localhost:3001/api
 * @production    - Uses NEXT_PUBLIC_API_URL environment variable
 */
export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-type": "application/json",
  },
});
