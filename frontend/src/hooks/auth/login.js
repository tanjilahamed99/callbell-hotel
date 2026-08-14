import axios from "axios";
import { BASE_URL } from "../../config/constant";

const login = (data) => {
  return axios.post(`${BASE_URL}/auth/login`, data);
};

export default login;
