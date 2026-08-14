import axios from "axios";
import { BASE_URL } from "../../config/constant";

const getPaygicInfo = (id, email) => {
  return axios.get(`${BASE_URL}/admin/paygic/${id}/${email}`);
};

export default getPaygicInfo;
