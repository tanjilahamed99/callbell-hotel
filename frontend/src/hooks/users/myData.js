
import axios from "axios";
import { BASE_URL } from "../../config/constant";

const myData = ({ id }) => {
  return axios.get(`${BASE_URL}/users/myData/${id}`);
};

export default myData;
