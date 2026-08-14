import axios from "axios";
import { BASE_URL } from "../../config/constant";

const deleteSub = (id, email, subId) => {
  return axios.delete(`${BASE_URL}/admin/subscription/delete/${id}/${email}/${subId}`);
};

export default deleteSub;
