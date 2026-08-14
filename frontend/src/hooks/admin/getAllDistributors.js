import axios from "axios";
import { BASE_URL } from "../../config/constant";

const getAllDistributors = () => {
  return axios.get(`${BASE_URL}/admin/distributors/get/all`);
};

export default getAllDistributors;
