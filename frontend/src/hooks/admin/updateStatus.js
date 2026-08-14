import axios from "axios";
import { BASE_URL } from "../../config/constant";

const updateDistributorStatus = ({ userId, status }) => {
  return axios.put(`${BASE_URL}/admin/distributor/update/status/${userId}`, {
    status,
  });
};

export default updateDistributorStatus;
