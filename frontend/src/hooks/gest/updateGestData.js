import axios from "axios";
import { BASE_URL } from "../../config/constant";

const updateGestData = (data) => {
  return axios.post(`${BASE_URL}/gest/update`, data);
};

export default updateGestData;
