import { BASE_URL } from "../../config/constant";
import axios from "axios";

const getUser = ({ id }) => {
  return axios.get(`${BASE_URL}/users/get/${id}`);
};

export default getUser;
