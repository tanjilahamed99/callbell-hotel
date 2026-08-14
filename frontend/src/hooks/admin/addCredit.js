import axios from "axios";
import { BASE_URL } from "../../config/constant";

const addCredit = (email, userId, data) => {
  return axios.post(`${BASE_URL}/admin/credit/add/${userId}/${email}`, data);
};

export default addCredit;
