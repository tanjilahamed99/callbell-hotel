import axios from "axios";
import { BASE_URL } from "../../config/constant";

const getAllSubscriptions = (id, email) => {
  return axios.get(`${BASE_URL}/admin/subscriptions/${id}/${email}`);
};

export default getAllSubscriptions;
