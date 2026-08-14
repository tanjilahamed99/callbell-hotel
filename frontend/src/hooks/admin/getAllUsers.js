import axios from "axios";
import { BASE_URL } from "../../config/constant";

const getAllUsers = (id, email) => {
  return axios.get(`${BASE_URL}/admin/users/${id}/${email}`);
};

export default getAllUsers;
