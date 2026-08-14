import axios from "axios";
import { BASE_URL } from "../../config/constant";

export const updatePaymentCredentials = ({ userId, email, data }) => {
  return axios.put(`${BASE_URL}/admin/paygic/set/${userId}/${email}`, data);
};
