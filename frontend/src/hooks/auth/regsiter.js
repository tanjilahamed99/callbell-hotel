import axios from "axios";
import { BASE_URL } from "../../config/constant";

const register = (data) => {
  return axios.post(`${BASE_URL}/auth/register`, data);
};

export default register;
