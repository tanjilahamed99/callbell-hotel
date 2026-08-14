import axios from "axios";
import { BASE_URL } from "../../config/constant";

const getAllHistory = (id, email) => {
  return axios.get(`${BASE_URL}/admin/history/${id}/${email}`);
};

export default getAllHistory;
