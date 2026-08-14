import axios from "axios";
import { BASE_URL } from "../../config/constant";

const deleteUser = (id, email, userId) => {
  return axios.delete(`${BASE_URL}/admin/user/delete/${id}/${email}/${userId}`);
};

export default deleteUser;
